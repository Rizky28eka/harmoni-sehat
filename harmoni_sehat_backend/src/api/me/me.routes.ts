import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import protect from '../../middlewares/protect';
import authorize from '../../middlewares/authorize';
import { validate } from '../../middlewares/validator';
import MedicationReminder from '../../models/MedicationReminder';
import MedicalRecord from '../../models/MedicalRecord';
import Pasien from '../../models/Pasien';
import Dokter from '../../models/Dokter';
import Prescription from '../../models/Prescription';
import PrescriptionDrug from '../../models/PrescriptionDrug';
import User from '../../models/User';
import RefreshToken from '../../models/RefreshToken';
import DeviceToken from '../../models/DeviceToken';
import { AppError } from '../../utils/AppError';
import { getActor } from '../../utils/actor';
import { asSystem, requestContext } from '../../utils/requestContext';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, PUBLIC_BASE_URL } from '../../config/env';
import { actorFromUser } from '../../utils/actor';
import { verifyAccessToken } from '../../middlewares/protect';

const router = Router();

const h = (fn: (req: Request, res: Response) => Promise<any>, status = 200) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req, res);
      if (!res.headersSent) res.status(status).json({ status: 'success', data });
    } catch (e) { next(e); }
  };

router.use((req, res, next) => (req.path.endsWith('/pdf') && req.method === 'GET' ? next() : protect(req, res, next)));

/* ---------------------------------------------------- medication reminders */
const reminderSchema = z.object({
  nama_obat: z.string().min(1).max(120),
  dosis: z.string().max(80).optional(),
  jam: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam HH:mm')).min(1).max(12),
  tanggal_mulai: z.coerce.date().optional(),
  tanggal_selesai: z.coerce.date().optional(),
  catatan: z.string().max(300).optional(),
  resep_id: z.string().optional(),
  is_active: z.boolean().optional(),
});

router.get('/reminders', authorize('pasien'), h(async () => MedicationReminder.find().sort({ createdAt: -1 }).lean()));
router.post('/reminders', authorize('pasien'), validate(reminderSchema), h(async (req) => MedicationReminder.create({ ...req.body, user_id: (req as any).user._id }), 201));
router.put('/reminders/:id', authorize('pasien'), validate(reminderSchema.partial()), h(async (req) => {
  const r = await MedicationReminder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!r) throw new AppError('Pengingat tidak ditemukan', 404);
  return r;
}));
router.delete('/reminders/:id', authorize('pasien'), h(async (req) => {
  const r = await MedicationReminder.findByIdAndDelete(req.params.id);
  if (!r) throw new AppError('Pengingat tidak ditemukan', 404);
  return null;
}));

/* ------------------------------------------------------- medical timeline */
router.get('/medical-records/:id/pdf-link', protect, authorize('pasien', 'dokter'), h(async (req) => {
  const rec = await MedicalRecord.findById(req.params.id).select('_id'); // row-scoped
  if (!rec) throw new AppError('Rekam medis tidak ditemukan', 404);
  const t = jwt.sign({ purpose: 'record-pdf', rid: String(rec._id), uid: String((req as any).user._id) }, JWT_SECRET, { expiresIn: '5m' });
  return { url: `${PUBLIC_BASE_URL}/api/v1/me/medical-records/${rec._id}/pdf?t=${t}` };
}));

router.get('/medical-timeline', authorize('pasien'), h(async () =>
  MedicalRecord.find().sort({ tanggal_rekam_medis: -1 }).populate('dokter_id', 'nama spesialisasi_id').populate('resep_id')));

router.get('/medical-records/:id/pdf', async (req, res, next) => {
  try {
    let claims: any;
    try { claims = jwt.verify(String(req.query.t ?? ''), JWT_SECRET); } catch { throw new AppError('Tautan tidak valid atau kedaluwarsa', 401); }
    if (claims.purpose !== 'record-pdf' || claims.rid !== req.params.id) throw new AppError('Tautan tidak valid', 403);
    const { user, roleName } = await verifyAccessToken(jwt.sign({ id: claims.uid }, JWT_SECRET, { expiresIn: '1m' }));
    const actor = await actorFromUser(user, roleName);
    const rec = await requestContext.run({ actor }, async () => await MedicalRecord.findById(req.params.id)); // row-scoped, decrypted via getters
    if (!rec) throw new AppError('Rekam medis tidak ditemukan', 404);
    const [pasien, dokter, resep] = await asSystem(async () => Promise.all([
      Pasien.findById(rec.pasien_id).lean(),
      rec.dokter_id ? Dokter.findById(rec.dokter_id).lean() : null,
      rec.resep_id ? Prescription.findById(rec.resep_id).lean() : null,
    ]));
    const obat = resep ? await asSystem(() => PrescriptionDrug.find({ resep_id: resep._id }).populate('obat_id', 'nama').lean()) : [];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rekam-medis-${rec._id}.pdf"`);
    // Loaded lazily: pdfkit pulls in ESM-only deps that are only needed when exporting.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(18).text('Harmoni Sehat', { align: 'center' }).fontSize(12).text('Ringkasan Rekam Medis', { align: 'center' }).moveDown();
    const line = (k: string, v?: any) => v !== undefined && v !== null && v !== '' && doc.font('Helvetica-Bold').text(`${k}: `, { continued: true }).font('Helvetica').text(String(v));
    line('Pasien', pasien?.nama);
    line('Tanggal Lahir', pasien?.tanggal_lahir ? new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID') : undefined);
    line('Dokter', dokter?.nama);
    line('Tanggal', new Date(rec.tanggal_rekam_medis).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
    doc.moveDown();
    line('Diagnosis', rec.diagnosis);
    line('Catatan Dokter', rec.catatan_dokter);
    line('Tekanan Darah', rec.tekanan_darah);
    line('Suhu Tubuh', rec.suhu_tubuh ? `${rec.suhu_tubuh} °C` : undefined);
    line('Tinggi / Berat', rec.tinggi_badan || rec.berat_badan ? `${rec.tinggi_badan ?? '-'} cm / ${rec.berat_badan ?? '-'} kg` : undefined);
    line('Alergi', rec.alergi?.join(', '));
    line('Riwayat Penyakit', rec.riwayat_penyakit?.join(', '));
    if (obat.length) {
      doc.moveDown().font('Helvetica-Bold').text('Resep');
      obat.forEach((o: any, i: number) => doc.font('Helvetica').text(`${i + 1}. ${o.obat_id?.nama ?? '-'} — ${o.dosis}, ${o.jumlah} unit, ${o.aturan_pakai}`));
    }
    doc.moveDown(2).fontSize(8).fillColor('gray').text('Dokumen ini dihasilkan otomatis oleh aplikasi Harmoni Sehat dan bukan pengganti surat keterangan dokter resmi.');
    doc.end();
  } catch (e) { next(e); }
});

/* --------------------------------------------------- consent & account data */
router.post('/consent', validate(z.object({ version: z.string().min(1).max(20) })), h(async (req) => {
  const u = await User.findByIdAndUpdate((req as any).user._id, { consent_version: req.body.version, consent_at: new Date() }, { new: true });
  return { consent_version: u?.consent_version, consent_at: u?.consent_at };
}));

/** Right to erasure (UU PDP): deactivates, anonymises identity, revokes sessions. Medical records are retained de-identified. */
router.delete('/account', validate(z.object({ password: z.string().min(1) })), h(async (req) => {
  const actor = await getActor(req);
  const user = await User.findById(actor.userId).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new AppError('Password salah', 401);
  await asSystem(async () => {
    await Pasien.updateOne({ user_id: user._id }, { nama: 'Pengguna Dihapus', nik: `DEL${String(user._id).slice(-13)}`.slice(0, 16).padEnd(16, '0'), alamat: '-', no_telepon: '-' });
    await Dokter.updateOne({ user_id: user._id }, { nama: 'Dokter Dihapus', status: 'inactive', bio: '', foto: '' });
    await MedicationReminder.deleteMany({ user_id: user._id });
    await DeviceToken.deleteMany({ user_id: user._id });
    await RefreshToken.deleteMany({ user_id: user._id });
    user.is_active = false;
    user.email = `deleted-${user._id}@deleted.invalid`;
    await user.save({ validateBeforeSave: false });
  });
  return null;
}));

export default router;
