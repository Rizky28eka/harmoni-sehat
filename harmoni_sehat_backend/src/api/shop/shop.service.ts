import crypto from 'crypto';
import Drug from '../../models/Drug';
import DrugCart from '../../models/DrugCart';
import DrugOrder, { IDrugOrder } from '../../models/DrugOrder';
import DrugOrderDetail from '../../models/DrugOrderDetail';
import Prescription from '../../models/Prescription';
import PrescriptionDrug from '../../models/PrescriptionDrug';
import Pasien from '../../models/Pasien';
import Apoteker from '../../models/Apoteker';
import Transaction from '../../models/Transaction';
import { AppError } from '../../utils/AppError';
import { Actor } from '../../utils/actor';
import { asSystem } from '../../utils/requestContext';
import { createPayment, onPaid, onFailed, failTransaction, refundTransaction } from '../../services/payment';
import { notify } from '../../services/notify';

const PENDING_TTL_MS = 30 * 60 * 1000;
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const orderCode = () => `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const requirePasien = (actor: Actor) => {
  if (actor.role !== 'pasien' || !actor.profileId) throw new AppError('Hanya pasien', 403);
  return actor.profileId;
};

/* ----------------------------------------------------------------- catalog */

export const browseDrugs = async (q: { search?: string; kategori?: string; page?: number; limit?: number }) => {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(50, Math.max(1, q.limit ?? 20));
  const filter: Record<string, any> = { stok: { $gt: 0 }, tgl_kadaluarsa: { $gt: new Date() } };
  if (q.search) filter.nama = { $regex: escapeRegex(q.search).slice(0, 64), $options: 'i' };
  if (q.kategori) filter.kategori = q.kategori;
  const [data, total, kategori] = await Promise.all([
    Drug.find(filter).sort({ nama: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Drug.countDocuments(filter),
    Drug.distinct('kategori'),
  ]);
  return { data, total, page, limit, kategori };
};

/* -------------------------------------------------------------------- cart */

export const getCart = async (actor: Actor) => {
  const pasienId = requirePasien(actor);
  const items = await DrugCart.find({ pasien_id: pasienId }).populate('obat_id').lean();
  const rows = items
    .filter((i) => i.obat_id)
    .map((i: any) => ({
      _id: i._id,
      obat: i.obat_id,
      jumlah: i.jumlah,
      subtotal: i.jumlah * i.obat_id.harga,
      tersedia: i.obat_id.stok >= i.jumlah && new Date(i.obat_id.tgl_kadaluarsa) > new Date(),
    }));
  return { items: rows, total: rows.reduce((s, r) => s + r.subtotal, 0) };
};

export const setCartItem = async (actor: Actor, obatId: string, jumlah: number) => {
  const pasienId = requirePasien(actor);
  if (jumlah <= 0) {
    await DrugCart.deleteOne({ pasien_id: pasienId, obat_id: obatId });
    return getCart(actor);
  }
  const drug = await Drug.findById(obatId);
  if (!drug) throw new AppError('Obat tidak ditemukan', 404);
  if (drug.stok < jumlah) throw new AppError(`Stok ${drug.nama} tidak mencukupi (tersisa ${drug.stok})`, 409);
  await DrugCart.findOneAndUpdate({ pasien_id: pasienId, obat_id: obatId }, { jumlah }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return getCart(actor);
};

export const clearCart = async (actor: Actor) => {
  await DrugCart.deleteMany({ pasien_id: requirePasien(actor) });
};

/* ---------------------------------------------------------------- checkout */

export interface CheckoutInput {
  alamat_pengiriman?: string;
  catatan_pengiriman?: string;
  metode_pembayaran_id?: string;
  resep_id?: string;
}

const restock = async (orderId: any) => {
  const details = await asSystem(() => DrugOrderDetail.find({ pesanan_id: orderId }));
  await asSystem(() => Promise.all(details.map((d) => Drug.updateOne({ _id: d.obat_id }, { $inc: { stok: d.jumlah } }))));
};

export const checkout = async (actor: Actor, input: CheckoutInput) => {
  const pasienId = requirePasien(actor);
  const pasien = await Pasien.findById(pasienId);
  if (!pasien) throw new AppError('Profil pasien tidak ditemukan', 404);

  const cart = await DrugCart.find({ pasien_id: pasienId }).populate('obat_id');
  if (!cart.length) throw new AppError('Keranjang kosong', 400);

  // Prescription gate for restricted drugs.
  let allowance = new Map<string, number>();
  if (input.resep_id) {
    const resep = await Prescription.findOne({ _id: input.resep_id, status: 'active', expired_at: { $gt: new Date() } });
    if (!resep) throw new AppError('Resep tidak valid atau sudah kedaluwarsa', 400);
    if (await asSystem(() => DrugOrder.exists({ resep_id: resep._id, status: { $ne: 'cancelled' } }))) {
      throw new AppError('Resep ini sudah pernah digunakan untuk pesanan', 409);
    }
    const items = await asSystem(() => PrescriptionDrug.find({ resep_id: resep._id }));
    allowance = new Map(items.map((i) => [String(i.obat_id), i.jumlah]));
  }

  const lines: { drug: any; jumlah: number }[] = [];
  for (const item of cart) {
    const drug: any = item.obat_id;
    if (!drug) continue;
    if (new Date(drug.tgl_kadaluarsa) <= new Date()) throw new AppError(`${drug.nama} sudah kedaluwarsa`, 409);
    if (drug.butuh_resep) {
      const allowed = allowance.get(String(drug._id)) ?? 0;
      if (allowed < item.jumlah) throw new AppError(`${drug.nama} memerlukan resep dokter yang sesuai`, 403);
    }
    lines.push({ drug, jumlah: item.jumlah });
  }
  if (!lines.length) throw new AppError('Keranjang kosong', 400);

  // Reserve stock atomically (compare-and-decrement), rolling back on any shortfall.
  const reserved: typeof lines = [];
  try {
    for (const l of lines) {
      const r = await asSystem(() => Drug.updateOne({ _id: l.drug._id, stok: { $gte: l.jumlah } }, { $inc: { stok: -l.jumlah } }));
      if (r.modifiedCount !== 1) throw new AppError(`Stok ${l.drug.nama} tidak mencukupi`, 409);
      reserved.push(l);
    }
  } catch (err) {
    await asSystem(() => Promise.all(reserved.map((l) => Drug.updateOne({ _id: l.drug._id }, { $inc: { stok: l.jumlah } }))));
    throw err;
  }

  const total = lines.reduce((s, l) => s + l.jumlah * l.drug.harga, 0);
  let order: IDrugOrder | undefined;
  try {
    order = await asSystem(() =>
      DrugOrder.create({
        pasien_id: pasienId,
        kode_pesanan: orderCode(),
        total_harga: total,
        status: 'pending',
        payment_status: 'unpaid',
        alamat_pengiriman: input.alamat_pengiriman || pasien.alamat,
        catatan_pengiriman: input.catatan_pengiriman,
        resep_id: input.resep_id,
      }),
    );
    await asSystem(() =>
      DrugOrderDetail.insertMany(
        lines.map((l) => ({ pesanan_id: order!._id, obat_id: l.drug._id, jumlah: l.jumlah, harga_satuan: l.drug.harga, subtotal: l.jumlah * l.drug.harga })),
      ),
    );
    const transaction = await createPayment({
      userId: actor.userId,
      amount: total,
      type: 'DrugOrder',
      entityId: String(order._id),
      metodeId: input.metode_pembayaran_id,
      customer: { name: pasien.nama, phone: pasien.no_telepon },
      itemName: `Pesanan ${order.kode_pesanan}`,
    });
    await asSystem(() => DrugOrder.updateOne({ _id: order!._id }, { transaksi_id: transaction._id }));
    await DrugCart.deleteMany({ pasien_id: pasienId });
    return { order: await DrugOrder.findById(order._id), transaction };
  } catch (err) {
    await asSystem(() => Promise.all(lines.map((l) => Drug.updateOne({ _id: l.drug._id }, { $inc: { stok: l.jumlah } }))));
    if (order) await asSystem(() => DrugOrder.updateOne({ _id: order!._id }, { status: 'cancelled' }));
    throw err;
  }
};

/* ---------------------------------------------------------------- payments */

onPaid('DrugOrder', async (tx) => {
  const order = await asSystem(() =>
    DrugOrder.findOneAndUpdate({ _id: tx.transaksiable_id, status: 'pending' }, { status: 'processing', payment_status: 'paid' }, { new: true }),
  );
  if (!order) return;
  await notify(tx.user_id.toString(), { judul: 'Pembayaran diterima', isi: `Pesanan ${order.kode_pesanan} sedang diproses apotek`, tipe: 'success', data: { type: 'order', id: String(order._id) } });
  const pharmacists = await asSystem(() => Apoteker.find({ is_verified: true }).select('user_id'));
  await Promise.all(pharmacists.map((p) => notify(String(p.user_id), { judul: 'Pesanan baru', isi: `Pesanan ${order.kode_pesanan} perlu diproses`, data: { type: 'order', id: String(order._id) } })));
});

onFailed('DrugOrder', async (tx) => {
  const order = await asSystem(() => DrugOrder.findOneAndUpdate({ _id: tx.transaksiable_id, status: 'pending' }, { status: 'cancelled' }, { new: true }));
  if (order) await restock(order._id);
});

/* ------------------------------------------------------------------ orders */

export const listOrders = async (status?: string, page = 1, limit = 20) => {
  const filter: Record<string, any> = {};
  if (status) filter.status = { $in: status.split(',') };
  const [data, total] = await Promise.all([
    DrugOrder.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('pasien_id', 'nama alamat no_telepon').lean(),
    DrugOrder.countDocuments(filter),
  ]);
  return { data, total, page, limit };
};

export const getOrder = async (id: string) => {
  const order = await DrugOrder.findById(id).populate('pasien_id', 'nama alamat no_telepon').lean();
  if (!order) throw new AppError('Pesanan tidak ditemukan', 404);
  const [details, transaksi] = await Promise.all([
    DrugOrderDetail.find({ pesanan_id: id }).populate('obat_id', 'nama satuan kode_obat').lean(),
    asSystem(async () => (order.transaksi_id ? Transaction.findById(order.transaksi_id).lean() : null)),
  ]);
  return { ...order, detail: details, transaksi };
};

export const cancelOrder = async (actor: Actor, id: string, reason?: string) => {
  const order = await DrugOrder.findById(id);
  if (!order) throw new AppError('Pesanan tidak ditemukan', 404);

  if (actor.role === 'pasien' && order.status !== 'pending') {
    throw new AppError('Pesanan yang sudah dibayar hanya dapat dibatalkan oleh apotek', 409);
  }
  if (actor.role === 'farmasi' && !['pending', 'processing'].includes(order.status)) {
    throw new AppError('Pesanan tidak dapat dibatalkan pada status ini', 409);
  }
  const updated = await asSystem(() =>
    DrugOrder.findOneAndUpdate({ _id: id, status: order.status }, { status: 'cancelled', catatan_pengiriman: reason ?? order.catatan_pengiriman }, { new: true }),
  );
  if (!updated) throw new AppError('Status pesanan berubah, coba lagi', 409);
  await restock(updated._id);

  if (order.payment_status === 'paid') {
    await refundTransaction(order.transaksi_id, reason ?? 'Pesanan dibatalkan');
  } else if (order.transaksi_id) {
    const tx = await asSystem(() => Transaction.findById(order.transaksi_id));
    if (tx?.status === 'pending') await failTransaction(tx.order_id, 'failed');
  }
  const pasien = await asSystem(() => Pasien.findById(order.pasien_id));
  if (pasien && actor.role === 'farmasi') {
    await notify(String(pasien.user_id), { judul: 'Pesanan dibatalkan', isi: `Pesanan ${order.kode_pesanan} dibatalkan apotek${reason ? `: ${reason}` : ''}`, tipe: 'warning', data: { type: 'order', id: String(order._id) } });
  }
  return updated;
};

const NEXT: Record<string, string> = { processing: 'shipped', shipped: 'delivered' };

export const advanceOrder = async (actor: Actor, id: string, noResi?: string) => {
  const order = await DrugOrder.findById(id);
  if (!order) throw new AppError('Pesanan tidak ditemukan', 404);
  if (actor.role === 'farmasi') {
    const apt = await asSystem(() => Apoteker.findOne({ user_id: actor.userId }));
    if (!apt?.is_verified) throw new AppError('Akun apoteker belum terverifikasi', 403);
  }
  if (actor.role === 'pasien' && order.status !== 'shipped') throw new AppError('Pesanan belum dikirim', 409);
  const next = NEXT[order.status];
  if (!next || order.payment_status !== 'paid') throw new AppError('Status pesanan tidak dapat dilanjutkan', 409);

  const updated = await asSystem(() =>
    DrugOrder.findOneAndUpdate({ _id: id, status: order.status }, { status: next, ...(noResi ? { no_resi: noResi } : {}) }, { new: true }),
  );
  if (!updated) throw new AppError('Status pesanan berubah, coba lagi', 409);
  const pasien = await asSystem(() => Pasien.findById(order.pasien_id));
  if (pasien) {
    await notify(String(pasien.user_id), {
      judul: next === 'shipped' ? 'Pesanan dikirim' : 'Pesanan selesai',
      isi: next === 'shipped' ? `Pesanan ${order.kode_pesanan} dalam pengiriman${noResi ? ` (resi ${noResi})` : ''}` : `Pesanan ${order.kode_pesanan} telah diterima`,
      tipe: 'info',
      data: { type: 'order', id: String(order._id) },
    });
  }
  return updated;
};

export const orderFromPrescription = async (actor: Actor, resepId: string, input: Omit<CheckoutInput, 'resep_id'>) => {
  const pasienId = requirePasien(actor);
  const resep = await Prescription.findOne({ _id: resepId, status: 'active', expired_at: { $gt: new Date() } });
  if (!resep) throw new AppError('Resep tidak valid atau sudah kedaluwarsa', 404);
  const items = await asSystem(() => PrescriptionDrug.find({ resep_id: resep._id }));
  await DrugCart.deleteMany({ pasien_id: pasienId });
  for (const it of items) {
    const drug = await Drug.findById(it.obat_id);
    if (drug && drug.stok >= it.jumlah) {
      await DrugCart.create({ pasien_id: pasienId, obat_id: it.obat_id, jumlah: it.jumlah });
    }
  }
  return checkout(actor, { ...input, resep_id: resepId });
};

export const expireUnpaidOrders = async () => {
  const cutoff = new Date(Date.now() - PENDING_TTL_MS);
  const stale = await asSystem(() => DrugOrder.find({ status: 'pending', payment_status: 'unpaid', createdAt: { $lt: cutoff } }));
  for (const o of stale) {
    const tx = o.transaksi_id ? await asSystem(() => Transaction.findById(o.transaksi_id)) : null;
    if (tx?.status === 'pending') await failTransaction(tx.order_id, 'expired');
    else {
      await asSystem(() => DrugOrder.updateOne({ _id: o._id, status: 'pending' }, { status: 'cancelled' }));
      await restock(o._id);
    }
  }
  return stale.length;
};
