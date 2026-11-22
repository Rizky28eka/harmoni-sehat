import mongoose from 'mongoose';
import Consultation, { IConsultation } from '../../models/Consultation';
import Dokter from '../../models/Dokter';
import Pasien from '../../models/Pasien';
import PracticeSchedule from '../../models/PracticeSchedule';
import DoctorReview from '../../models/DoctorReview';
import MedicalRecord from '../../models/MedicalRecord';
import Prescription from '../../models/Prescription';
import PrescriptionDrug from '../../models/PrescriptionDrug';
import Drug from '../../models/Drug';
import Transaction from '../../models/Transaction';
import ChatMessage from '../../models/ChatMessage';
import { AppError } from '../../utils/AppError';
import { Actor } from '../../utils/actor';
import { asSystem } from '../../utils/requestContext';
import { generateSlots, dayNameOf, parseWibDate, toMinutes } from '../../services/schedule';
import { createPayment, onPaid, onFailed, failTransaction } from '../../services/payment';
import { notify } from '../../services/notify';
import { cached } from '../../utils/cache';
import { analyzeSentiment } from '../gemini/gemini.service';

const PENDING_TTL_MS = 15 * 60 * 1000;
const LEAD_TIME_MS = 15 * 60 * 1000;
const FREE_CANCEL_MS = 2 * 60 * 60 * 1000;

const activeStatuses = ['pending', 'scheduled', 'ongoing'];
const slotKey = (dokterId: string, start: Date) => `${dokterId}|${start.toISOString()}`;
const videoUrl = (id: string) => `https://meet.jit.si/HarmoniSehat-${id}`;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ------------------------------------------------------------------ doctors */

export interface DoctorQuery {
  search?: string;
  spesialisasi?: string;
  minRating?: number;
  maxFee?: number;
  sort?: 'rating' | 'fee_asc' | 'fee_desc' | 'name';
  page?: number;
  limit?: number;
}

const ratingStats = async (dokterIds: string[]) => {
  const rows = await DoctorReview.aggregate([
    { $match: { dokter_id: { $in: dokterIds } } },
    { $group: { _id: '$dokter_id', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  return new Map<string, { avg: number; count: number }>(rows.map((r) => [r._id, { avg: Math.round(r.avg * 10) / 10, count: r.count }]));
};

export const searchDoctors = (q: DoctorQuery) => cached(`doctors:${JSON.stringify(q)}`, 30, () => searchDoctorsUncached(q));

const searchDoctorsUncached = async (q: DoctorQuery) => {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(50, Math.max(1, q.limit ?? 10));
  const filter: Record<string, any> = { is_verified: true, status: 'active' };
  if (q.search) filter.nama = { $regex: escapeRegex(q.search).slice(0, 64), $options: 'i' };
  if (q.spesialisasi && mongoose.isValidObjectId(q.spesialisasi)) filter.spesialisasi_id = q.spesialisasi;
  if (q.maxFee !== undefined) filter.biaya_konsultasi = { $lte: q.maxFee };

  // Rating is computed, so rating filter/sort happen after aggregation.
  const all = await Dokter.find(filter).populate('spesialisasi_id').lean();
  const stats = await ratingStats(all.map((d) => d._id as string));
  let rows = all.map((d) => ({
    ...d,
    rating: stats.get(d._id as string)?.avg ?? 0,
    jumlah_ulasan: stats.get(d._id as string)?.count ?? 0,
  }));
  if (q.minRating) rows = rows.filter((d) => d.rating >= q.minRating!);

  const sort = q.sort ?? 'rating';
  rows.sort((a, b) =>
    sort === 'fee_asc' ? a.biaya_konsultasi - b.biaya_konsultasi
    : sort === 'fee_desc' ? b.biaya_konsultasi - a.biaya_konsultasi
    : sort === 'name' ? a.nama.localeCompare(b.nama)
    : b.rating - a.rating || b.jumlah_ulasan - a.jumlah_ulasan,
  );

  return { data: rows.slice((page - 1) * limit, page * limit), total: rows.length, page, limit };
};

export const getDoctorDetail = async (id: string) => {
  const dokter = await Dokter.findOne({ _id: id, is_verified: true }).populate('spesialisasi_id').lean();
  if (!dokter) throw new AppError('Dokter tidak ditemukan', 404);
  const [schedules, stats, reviews] = await Promise.all([
    PracticeSchedule.find({ dokter_id: id, is_active: true }).populate('klinik_id').lean(),
    ratingStats([id]),
    DoctorReview.find({ dokter_id: id }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);
  const s = stats.get(id);
  return { ...dokter, rating: s?.avg ?? 0, jumlah_ulasan: s?.count ?? 0, jadwal: schedules, ulasan: reviews };
};

/* -------------------------------------------------------------------- slots */

export const getAvailableSlots = async (dokterId: string, dateStr: string) => {
  const day = dayNameOf(dateStr);
  if (!day) throw new AppError('Format tanggal harus YYYY-MM-DD', 400);
  const schedules = await PracticeSchedule.find({ dokter_id: dokterId, is_active: true, hari: day });
  const all = schedules.flatMap((s) => generateSlots(dateStr, s));
  if (!all.length) return [];

  const dayStart = new Date(`${dateStr}T00:00:00+07:00`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);
  const now = new Date();
  const booked = await asSystem(() =>
    Consultation.find({
      dokter_id: dokterId,
      tanggal: { $gte: dayStart, $lt: dayEnd },
      status: { $in: activeStatuses },
      $or: [{ status: { $ne: 'pending' } }, { expires_at: { $gt: now } }],
    }).select('tanggal'),
  );
  const taken = new Set(booked.map((b) => b.tanggal.getTime()));
  const earliest = now.getTime() + LEAD_TIME_MS;
  return all
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .map((s) => ({ ...s, available: s.start.getTime() >= earliest && !taken.has(s.start.getTime()) }));
};

/* ------------------------------------------------------------------ booking */

export interface BookInput {
  dokter_id: string;
  jadwal_id: string;
  start: string; // ISO datetime of the slot
  keluhan: string;
  metode_pembayaran_id?: string;
}

export const bookConsultation = async (actor: Actor, input: BookInput) => {
  if (actor.role !== 'pasien' || !actor.profileId) throw new AppError('Hanya pasien yang dapat membuat konsultasi', 403);

  const dokter = await Dokter.findOne({ _id: input.dokter_id, is_verified: true, status: 'active' });
  if (!dokter) throw new AppError('Dokter tidak tersedia', 404);
  const schedule = await PracticeSchedule.findOne({ _id: input.jadwal_id, dokter_id: dokter._id, is_active: true });
  if (!schedule) throw new AppError('Jadwal tidak ditemukan', 404);

  const start = new Date(input.start);
  if (isNaN(start.getTime())) throw new AppError('Waktu slot tidak valid', 400);

  // The requested instant must be a real slot of that schedule on that weekday.
  const dateStr = new Date(start.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  const valid =
    dayNameOf(dateStr) === schedule.hari &&
    generateSlots(dateStr, schedule).some((s) => s.start.getTime() === start.getTime());
  if (!valid) throw new AppError('Slot tidak valid untuk jadwal ini', 400);
  if (start.getTime() < Date.now() + LEAD_TIME_MS) throw new AppError('Slot sudah lewat atau terlalu dekat', 400);

  const key = slotKey(dokter._id, start);
  // Release a stale unpaid hold on this exact slot, if any.
  await asSystem(() =>
    Consultation.updateOne(
      { slot_key: key, status: 'pending', expires_at: { $lt: new Date() } },
      { status: 'cancelled', cancel_reason: 'Pembayaran kedaluwarsa', $unset: { slot_key: 1 } },
    ),
  );

  const free = dokter.biaya_konsultasi <= 0;
  let consultation: IConsultation;
  try {
    consultation = await asSystem(() =>
      Consultation.create({
        pasien_id: actor.profileId,
        dokter_id: dokter._id,
        jadwal_id: schedule._id,
        tanggal: start,
        keluhan: input.keluhan,
        biaya: dokter.biaya_konsultasi,
        status: free ? 'scheduled' : 'pending',
        slot_key: key,
        expires_at: free ? undefined : new Date(Date.now() + PENDING_TTL_MS),
      }),
    );
  } catch (err: any) {
    if (err?.code === 11000) throw new AppError('Slot sudah dipesan, pilih waktu lain', 409);
    throw err;
  }

  if (free) {
    await markScheduled(consultation);
    return { consultation, transaction: null };
  }

  try {
    const pasien = await Pasien.findOne({ user_id: actor.userId });
    const transaction = await createPayment({
      userId: actor.userId,
      amount: dokter.biaya_konsultasi,
      type: 'Consultation',
      entityId: String(consultation._id),
      metodeId: input.metode_pembayaran_id,
      customer: { name: pasien?.nama, phone: pasien?.no_telepon },
      itemName: `Konsultasi ${dokter.nama}`,
    });
    return { consultation, transaction };
  } catch (err) {
    await asSystem(() =>
      Consultation.updateOne({ _id: consultation._id }, { status: 'cancelled', $unset: { slot_key: 1 } }),
    );
    throw err;
  }
};

const markScheduled = async (c: IConsultation) => {
  const updated = await asSystem(() =>
    Consultation.findOneAndUpdate(
      { _id: c._id, status: { $in: ['pending', 'scheduled'] } },
      { status: 'scheduled', video_call_url: videoUrl(String(c._id)), $unset: { expires_at: 1 } },
      { new: true },
    ),
  );
  if (!updated) return;
  const [dokter, pasien] = await asSystem(() => Promise.all([Dokter.findById(updated.dokter_id), Pasien.findById(updated.pasien_id)]));
  const when = updated.tanggal.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' });
  if (pasien) await notify(String(pasien.user_id), { judul: 'Konsultasi terjadwal', isi: `Konsultasi dengan ${dokter?.nama} pada ${when} WIB`, tipe: 'success', data: { type: 'consultation', id: String(updated._id) } });
  if (dokter) await notify(String(dokter.user_id), { judul: 'Konsultasi baru', isi: `${pasien?.nama} menjadwalkan konsultasi pada ${when} WIB`, tipe: 'info', data: { type: 'consultation', id: String(updated._id) } });
};

const releaseConsultation = async (id: any, reason: string) => {
  const c = await asSystem(() =>
    Consultation.findOneAndUpdate(
      { _id: id, status: { $in: ['pending', 'scheduled'] } },
      { status: 'cancelled', cancel_reason: reason, $unset: { slot_key: 1, expires_at: 1 } },
      { new: true },
    ),
  );
  return c;
};

onPaid('Consultation', async (tx) => {
  const c = await asSystem(() => Consultation.findById(tx.transaksiable_id));
  if (c) await markScheduled(c);
});
onFailed('Consultation', async (tx) => {
  await releaseConsultation(tx.transaksiable_id, 'Pembayaran gagal atau kedaluwarsa');
});

export const cancelConsultation = async (actor: Actor, id: string, reason?: string) => {
  const c = await Consultation.findById(id); // row-scoped: only participants find it
  if (!c) throw new AppError('Konsultasi tidak ditemukan', 404);
  if (!['pending', 'scheduled'].includes(c.status)) throw new AppError('Konsultasi tidak dapat dibatalkan', 409);

  const paid = c.status === 'scheduled' && c.biaya > 0;
  if (actor.role === 'pasien' && paid && c.tanggal.getTime() - Date.now() < FREE_CANCEL_MS) {
    throw new AppError('Pembatalan hanya bisa dilakukan lebih dari 2 jam sebelum jadwal', 409);
  }
  const updated = await releaseConsultation(c._id, reason || (actor.role === 'dokter' ? 'Dibatalkan dokter' : 'Dibatalkan pasien'));
  if (!updated) throw new AppError('Konsultasi tidak dapat dibatalkan', 409);

  if (paid) {
    // Record the refund; the actual money movement is done via the gateway dashboard.
    await asSystem(() => Transaction.updateOne({ transaksiable_id: c._id, status: 'completed' }, { status: 'refunded' }));
  } else {
    const tx = await asSystem(() => Transaction.findOne({ transaksiable_id: c._id, status: 'pending' }));
    if (tx) await asSystem(() => Transaction.updateOne({ _id: tx._id }, { status: 'failed' }));
  }

  const otherId = actor.role === 'pasien' ? updated.dokter_id : updated.pasien_id;
  const other = await asSystem(async (): Promise<{ user_id: any } | null> =>
    actor.role === 'pasien' ? Dokter.findById(otherId) : Pasien.findById(otherId),
  );
  if (other) await notify(String(other.user_id), { judul: 'Konsultasi dibatalkan', isi: updated.cancel_reason ?? '', tipe: 'warning', data: { type: 'consultation', id: String(updated._id) } });
  return updated;
};

export const startConsultation = async (actor: Actor, id: string) => {
  if (actor.role !== 'dokter') throw new AppError('Hanya dokter', 403);
  const c = await Consultation.findOneAndUpdate({ _id: id, status: 'scheduled' }, { status: 'ongoing' }, { new: true });
  if (!c) throw new AppError('Konsultasi tidak ditemukan atau belum terjadwal', 404);
  const pasien = await asSystem(() => Pasien.findById(c.pasien_id));
  if (pasien) await notify(String(pasien.user_id), { judul: 'Dokter siap', isi: 'Konsultasi Anda telah dimulai', tipe: 'info', data: { type: 'consultation', id: String(c._id) } });
  return c;
};

export interface CompleteInput {
  diagnosa: string;
  tindakan?: string;
  catatan_dokter?: string;
  tekanan_darah?: string;
  suhu_tubuh?: number;
  tinggi_badan?: number;
  berat_badan?: number;
  riwayat_penyakit?: string[];
  alergi?: string[];
  resep?: { catatan?: string; berlaku_hari?: number; obat: { obat_id: string; dosis: string; jumlah: number; aturan_pakai: string }[] };
}

export const completeConsultation = async (actor: Actor, id: string, input: CompleteInput) => {
  if (actor.role !== 'dokter') throw new AppError('Hanya dokter', 403);
  const c = await Consultation.findOne({ _id: id, status: { $in: ['scheduled', 'ongoing'] } });
  if (!c) throw new AppError('Konsultasi tidak ditemukan atau sudah selesai', 404);

  let prescription: any = null;
  if (input.resep?.obat?.length) {
    const drugIds = input.resep.obat.map((o) => o.obat_id);
    const found = await Drug.countDocuments({ _id: { $in: drugIds } });
    if (found !== new Set(drugIds).size) throw new AppError('Terdapat obat yang tidak valid pada resep', 400);
  }

  const record = await asSystem(async () => {
    const claimed = await Consultation.findOneAndUpdate(
      { _id: c._id, status: { $in: ['scheduled', 'ongoing'] } },
      { status: 'completed', diagnosa: input.diagnosa, tindakan: input.tindakan, catatan_dokter: input.catatan_dokter, $unset: { slot_key: 1 } },
      { new: true },
    );
    if (!claimed) throw new AppError('Konsultasi sudah selesai', 409);

    if (input.resep?.obat?.length) {
      prescription = await Prescription.create({
        konsultasi_id: c._id,
        pasien_id: c.pasien_id,
        dokter_id: c.dokter_id,
        catatan: input.resep.catatan,
        expired_at: new Date(Date.now() + (input.resep.berlaku_hari ?? 30) * 86400000),
      });
      await PrescriptionDrug.insertMany(input.resep.obat.map((o) => ({ resep_id: prescription._id, ...o })));
    }

    return MedicalRecord.create({
      pasien_id: c.pasien_id,
      dokter_id: c.dokter_id,
      konsultasi_id: c._id,
      diagnosis: input.diagnosa,
      catatan_dokter: input.catatan_dokter,
      resep_id: prescription?._id,
      riwayat_penyakit: input.riwayat_penyakit,
      alergi: input.alergi,
      tinggi_badan: input.tinggi_badan,
      berat_badan: input.berat_badan,
      tekanan_darah: input.tekanan_darah,
      suhu_tubuh: input.suhu_tubuh,
    });
  });

  const pasien = await asSystem(() => Pasien.findById(c.pasien_id));
  if (pasien) await notify(String(pasien.user_id), { judul: 'Konsultasi selesai', isi: prescription ? 'Resep dan rekam medis tersedia' : 'Rekam medis tersedia', tipe: 'success', data: { type: 'consultation', id: String(c._id) } });
  return { consultation: await Consultation.findById(c._id), medicalRecord: record, prescription };
};

export const listMyConsultations = async (status?: string, page = 1, limit = 20) => {
  const filter: Record<string, any> = {};
  if (status) filter.status = { $in: status.split(',') };
  const [data, total] = await Promise.all([
    Consultation.find(filter)
      .sort({ tanggal: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('dokter_id', 'nama foto biaya_konsultasi spesialisasi_id')
      .populate('pasien_id', 'nama')
      .lean(),
    Consultation.countDocuments(filter),
  ]);
  return { data, total, page, limit };
};

export const getConsultation = async (id: string) => {
  const c = await Consultation.findById(id).populate('dokter_id', 'nama foto spesialisasi_id').populate('pasien_id', 'nama').lean();
  if (!c) throw new AppError('Konsultasi tidak ditemukan', 404);
  const [tx, prescription] = await Promise.all([
    asSystem(() => Transaction.findOne({ transaksiable_id: id }).sort({ createdAt: -1 }).lean()),
    asSystem(() => Prescription.findOne({ konsultasi_id: id }).lean()),
  ]);
  const items = prescription ? await asSystem(() => PrescriptionDrug.find({ resep_id: prescription._id }).populate('obat_id').lean()) : [];
  return { ...c, transaksi: tx, resep: prescription ? { ...prescription, obat: items } : null };
};

export const getMessages = async (consultationId: string, before?: string, limit = 50) => {
  const c = await Consultation.findById(consultationId).select('_id');
  if (!c) throw new AppError('Konsultasi tidak ditemukan', 404);
  const filter: Record<string, any> = { konsultasi_id: consultationId };
  if (before) filter.timestamp = { $lt: new Date(before) };
  const rows = await ChatMessage.find(filter).sort({ timestamp: -1 }).limit(Math.min(limit, 100)).lean();
  return rows.reverse();
};

export const reviewConsultation = async (actor: Actor, id: string, rating: number, komentar?: string) => {
  if (actor.role !== 'pasien') throw new AppError('Hanya pasien', 403);
  const c = await Consultation.findOne({ _id: id, status: 'completed' });
  if (!c) throw new AppError('Konsultasi belum selesai atau tidak ditemukan', 404);
  if (await asSystem(() => DoctorReview.exists({ konsultasi_id: c._id }))) throw new AppError('Ulasan sudah dikirim', 409);
  const sentimen = komentar ? await analyzeSentiment(komentar) : undefined;
  return asSystem(() =>
    DoctorReview.create({ pasien_id: c.pasien_id, dokter_id: c.dokter_id, konsultasi_id: c._id, rating, komentar, sentimen }),
  );
};

/** Periodic cleanup of unpaid holds. */
export const expirePendingConsultations = async () => {
  const stale = await asSystem(() => Consultation.find({ status: 'pending', expires_at: { $lt: new Date() } }).select('_id'));
  for (const c of stale) {
    const tx = await asSystem(() => Transaction.findOne({ transaksiable_id: c._id, status: 'pending' }));
    if (tx) await failTransaction(tx.order_id, 'expired');
    else await releaseConsultation(c._id, 'Pembayaran kedaluwarsa');
  }
  return stale.length;
};

export { toMinutes, parseWibDate };


/* ------------------------------------------------------- doctor self-service */

const requireDokter = (actor: Actor) => {
  if (actor.role !== 'dokter' || !actor.profileId) throw new AppError('Hanya dokter', 403);
  return actor.profileId;
};

export const listMySchedules = async (actor: Actor) => {
  const id = requireDokter(actor);
  return PracticeSchedule.find({ dokter_id: id }).populate('klinik_id', 'nama alamat').sort({ hari: 1, jam_mulai: 1 }).lean();
};

export const addSchedule = async (
  actor: Actor,
  input: { klinik_id: string; hari: string; jam_mulai: string; jam_selesai: string; durasi_menit?: number },
) => {
  const id = requireDokter(actor);
  if (toMinutes(input.jam_selesai) <= toMinutes(input.jam_mulai)) throw new AppError('Jam selesai harus setelah jam mulai', 400);
  // Reject overlaps on the same weekday so slots never double up.
  const sameDay = await PracticeSchedule.find({ dokter_id: id, hari: input.hari, is_active: true });
  const overlap = sameDay.some((s) => toMinutes(input.jam_mulai) < toMinutes(s.jam_selesai) && toMinutes(input.jam_selesai) > toMinutes(s.jam_mulai));
  if (overlap) throw new AppError('Jadwal bertabrakan dengan jadwal lain di hari yang sama', 409);
  return PracticeSchedule.create({ ...input, dokter_id: id });
};

export const updateSchedule = async (actor: Actor, scheduleId: string, patch: { is_active?: boolean }) => {
  const id = requireDokter(actor);
  const s = await PracticeSchedule.findOneAndUpdate({ _id: scheduleId, dokter_id: id }, patch, { new: true });
  if (!s) throw new AppError('Jadwal tidak ditemukan', 404);
  return s;
};

export const deleteSchedule = async (actor: Actor, scheduleId: string) => {
  const id = requireDokter(actor);
  const future = await asSystem(() => Consultation.exists({ jadwal_id: scheduleId, status: { $in: ['pending', 'scheduled', 'ongoing'] }, tanggal: { $gt: new Date() } }));
  if (future) throw new AppError('Masih ada konsultasi aktif pada jadwal ini. Nonaktifkan saja.', 409);
  const s = await PracticeSchedule.findOneAndDelete({ _id: scheduleId, dokter_id: id });
  if (!s) throw new AppError('Jadwal tidak ditemukan', 404);
};

export const doctorSummary = async (actor: Actor) => {
  const id = requireDokter(actor);
  const now = new Date();
  const startOfDay = new Date(`${new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10)}T00:00:00+07:00`);
  const endOfDay = new Date(startOfDay.getTime() + 86400000);
  const [today, upcoming, completed, ratings, earnings] = await Promise.all([
    Consultation.find({ tanggal: { $gte: startOfDay, $lt: endOfDay }, status: { $in: ['scheduled', 'ongoing'] } })
      .sort({ tanggal: 1 }).populate('pasien_id', 'nama').lean(),
    Consultation.countDocuments({ status: 'scheduled', tanggal: { $gte: now } }),
    Consultation.countDocuments({ status: 'completed' }),
    ratingStats([id]),
    asSystem(() => Consultation.aggregate([{ $match: { dokter_id: id, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$biaya' } } }])),
  ]);
  return {
    today,
    upcoming,
    completed,
    rating: ratings.get(id)?.avg ?? 0,
    jumlah_ulasan: ratings.get(id)?.count ?? 0,
    pendapatan: earnings[0]?.total ?? 0,
  };
};
