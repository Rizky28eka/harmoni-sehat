import { Router } from 'express';
import { accessPolicy } from '../../middlewares/accessPolicy';
import Dokter from '../../models/Dokter';
import Apoteker from '../../models/Apoteker';
import Pasien from '../../models/Pasien';
import Consultation from '../../models/Consultation';
import DrugOrder from '../../models/DrugOrder';
import Transaction from '../../models/Transaction';
import { AppError } from '../../utils/AppError';
import { notify } from '../../services/notify';
import { refundTransaction } from '../../services/payment';

const router = Router();
router.use(accessPolicy(['admin'], ['admin']));

router.get('/pending-verifications', async (_req, res, next) => {
  try {
    const [dokter, apoteker] = await Promise.all([
      Dokter.find({ is_verified: false }).populate('user_id', 'email').lean(),
      Apoteker.find({ is_verified: false }).populate('user_id', 'email').lean(),
    ]);
    res.json({ status: 'success', data: { dokter, apoteker } });
  } catch (e) {
    next(e);
  }
});

const reasonOf = (req: any) => String(req.body?.reason ?? '').trim().slice(0, 300);

router.post('/verify/dokter/:id', async (req, res, next) => {
  try {
    const approve = req.body?.approve !== false;
    const d = await Dokter.findByIdAndUpdate(req.params.id, { is_verified: approve, status: approve ? 'active' : 'inactive' }, { new: true });
    if (!d) throw new AppError('Dokter tidak ditemukan', 404);
    await notify(String(d.user_id), {
      judul: approve ? 'Akun dokter terverifikasi' : 'Verifikasi ditolak',
      isi: approve ? 'Anda sudah dapat menerima konsultasi.' : reasonOf(req) || 'Periksa kembali data STR Anda.',
      tipe: approve ? 'success' : 'error',
    });
    res.json({ status: 'success', data: d });
  } catch (e) {
    next(e);
  }
});

router.post('/verify/farmasi/:id', async (req, res, next) => {
  try {
    const approve = req.body?.approve !== false;
    const a = await Apoteker.findByIdAndUpdate(req.params.id, { is_verified: approve }, { new: true });
    if (!a) throw new AppError('Apoteker tidak ditemukan', 404);
    await notify(String(a.user_id), {
      judul: approve ? 'Akun apoteker terverifikasi' : 'Verifikasi ditolak',
      isi: approve ? 'Anda sudah dapat mengelola pesanan obat.' : reasonOf(req) || 'Periksa kembali data SIPA Anda.',
      tipe: approve ? 'success' : 'error',
    });
    res.json({ status: 'success', data: a });
  } catch (e) {
    next(e);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [pasien, dokter, apoteker, konsultasi, pesanan, revenue] = await Promise.all([
      Pasien.countDocuments(),
      Dokter.countDocuments({ is_verified: true }),
      Apoteker.countDocuments({ is_verified: true }),
      Consultation.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
      DrugOrder.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
      Transaction.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$total_biaya' }, n: { $sum: 1 } } }]),
    ]);
    const toMap = (rows: any[]) => Object.fromEntries(rows.map((r) => [r._id, r.n]));
    res.json({
      status: 'success',
      data: {
        pasien, dokter, apoteker,
        konsultasi: toMap(konsultasi),
        pesanan: toMap(pesanan),
        pendapatan: revenue[0]?.total ?? 0,
        transaksi_sukses: revenue[0]?.n ?? 0,
      },
    });
  } catch (e) {
    next(e);
  }
});

/** Refunds the gateway rejected (or could not be reached): needs an admin's attention. */
router.get('/refunds/failed', async (_req, res, next) => {
  try {
    res.json({ status: 'success', data: await Transaction.find({ refund_status: 'failed' }).sort({ updatedAt: -1 }).limit(100).lean() });
  } catch (e) { next(e); }
});

router.post('/refunds/:orderId/retry', async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({ order_id: req.params.orderId, status: 'completed', refund_status: 'failed' });
    if (!tx) throw new AppError('Tidak ada refund gagal untuk order ini', 404);
    const result = await refundTransaction(tx._id, 'Retry oleh admin');
    if (!result.ok) throw new AppError(result.error ?? 'Refund gagal', 502);
    res.json({ status: 'success', data: await Transaction.findById(tx._id) });
  } catch (e) { next(e); }
});

export default router;
