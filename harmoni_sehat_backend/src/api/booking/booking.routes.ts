import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import protect from '../../middlewares/protect';
import authorize from '../../middlewares/authorize';
import { validate } from '../../middlewares/validator';
import { getActor } from '../../utils/actor';
import { requireVerifiedProfessional } from '../../middlewares/verified';
import * as svc from './booking.service';

const router = Router();
router.use(protect);
router.use((req, res, next) => (req.method !== 'GET' && (req as any).userRole === 'dokter' ? requireVerifiedProfessional(req, res, next) : next()));

const h =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req, res);
      if (data !== undefined && !res.headersSent) res.json({ status: 'success', data });
    } catch (e) {
      next(e);
    }
  };

const num = (v: any) => (v === undefined || v === '' ? undefined : Number(v));

/* ----- doctor directory ----- */
router.get('/doctors', h(async (req) => {
  const q = req.query;
  return svc.searchDoctors({
    search: q.search as string,
    spesialisasi: q.spesialisasi as string,
    minRating: num(q.minRating),
    maxFee: num(q.maxFee),
    sort: q.sort as any,
    page: num(q.page),
    limit: num(q.limit),
  });
}));
router.get('/doctors/:id', h((req) => svc.getDoctorDetail(req.params.id)));
router.get('/doctors/:id/slots', h((req) => svc.getAvailableSlots(req.params.id, String(req.query.date ?? ''))));

/* ----- consultations ----- */
const bookSchema = z.object({
  dokter_id: z.string().min(1),
  jadwal_id: z.string().min(1),
  start: z.string().min(10, 'start wajib diisi (ISO datetime)'),
  keluhan: z.string().min(3, 'Keluhan wajib diisi').max(2000),
  metode_pembayaran_id: z.string().optional(),
});

router.post('/consultations', authorize('pasien'), validate(bookSchema), h(async (req, res) => {
  const result = await svc.bookConsultation(await getActor(req), req.body);
  res.status(201).json({ status: 'success', data: result });
}));

router.get('/consultations', h(async (req) =>
  svc.listMyConsultations(req.query.status as string, num(req.query.page) ?? 1, Math.min(num(req.query.limit) ?? 20, 100))));
router.get('/consultations/:id', h((req) => svc.getConsultation(req.params.id)));
router.get('/consultations/:id/messages', h((req) =>
  svc.getMessages(req.params.id, req.query.before as string, num(req.query.limit) ?? 50)));

router.post('/consultations/:id/cancel', validate(z.object({ reason: z.string().max(300).optional() })),
  h(async (req) => svc.cancelConsultation(await getActor(req), req.params.id, req.body.reason)));

router.post('/consultations/:id/start', authorize('dokter'),
  h(async (req) => svc.startConsultation(await getActor(req), req.params.id)));

const completeSchema = z.object({
  diagnosa: z.string().min(2, 'Diagnosa wajib diisi'),
  tindakan: z.string().optional(),
  catatan_dokter: z.string().optional(),
  tekanan_darah: z.string().optional(),
  suhu_tubuh: z.number().optional(),
  tinggi_badan: z.number().optional(),
  berat_badan: z.number().optional(),
  riwayat_penyakit: z.array(z.string()).optional(),
  alergi: z.array(z.string()).optional(),
  resep: z
    .object({
      catatan: z.string().optional(),
      berlaku_hari: z.number().int().min(1).max(365).optional(),
      obat: z.array(z.object({
        obat_id: z.string().min(1),
        dosis: z.string().min(1),
        jumlah: z.number().int().min(1),
        aturan_pakai: z.string().min(1),
      })).min(1),
    })
    .optional(),
});

router.post('/consultations/:id/complete', authorize('dokter'), validate(completeSchema),
  h(async (req) => svc.completeConsultation(await getActor(req), req.params.id, req.body)));

router.post('/consultations/:id/review', authorize('pasien'),
  validate(z.object({ rating: z.number().int().min(1).max(5), komentar: z.string().max(1000).optional() })),
  h(async (req, res) => {
    const r = await svc.reviewConsultation(await getActor(req), req.params.id, req.body.rating, req.body.komentar);
    res.status(201).json({ status: 'success', data: r });
  }));

/* ----- doctor self-service ----- */
const scheduleSchema = z.object({
  klinik_id: z.string().min(1),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
  jam_mulai: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:mm'),
  jam_selesai: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:mm'),
  durasi_menit: z.number().int().min(5).max(240).optional(),
});
router.get('/my/summary', authorize('dokter'), h(async (req) => svc.doctorSummary(await getActor(req))));
router.get('/my/schedules', authorize('dokter'), h(async (req) => svc.listMySchedules(await getActor(req))));
router.post('/my/schedules', authorize('dokter'), validate(scheduleSchema), h(async (req, res) => {
  const s = await svc.addSchedule(await getActor(req), req.body);
  res.status(201).json({ status: 'success', data: s });
}));
router.put('/my/schedules/:id', authorize('dokter'), validate(z.object({ is_active: z.boolean() })),
  h(async (req) => svc.updateSchedule(await getActor(req), req.params.id, req.body)));
router.delete('/my/schedules/:id', authorize('dokter'), h(async (req) => { await svc.deleteSchedule(await getActor(req), req.params.id); return null; }));

export default router;
