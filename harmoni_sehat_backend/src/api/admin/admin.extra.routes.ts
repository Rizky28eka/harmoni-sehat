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

router.post('/verify/dokter/:id', async (req, res, next) => {
  try {
    const approve = req.body?.approve !== false;
    const d = await Dokter.findByIdAndUpdate(req.params.id, { is_verified: approve, status: approve ? 'active' : 'inactive' }, { new: true });
    if (!d) throw new AppError('Dokter tidak ditemukan', 404);
    await notify(String(d.user_id), {
      judul: approve ? 'Akun dokter terverifikasi' : 'Verifikasi ditolak',
      isi: approve ? 'Anda sudah dapat menerima konsultasi.' : 'Periksa kembali data STR Anda.',
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
      isi: approve ? 'Anda sudah dapat mengelola pesanan obat.' : 'Periksa kembali data SIPA Anda.',
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

export default router;
