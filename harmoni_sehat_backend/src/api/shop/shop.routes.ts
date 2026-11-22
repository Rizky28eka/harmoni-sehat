import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import protect from '../../middlewares/protect';
import authorize from '../../middlewares/authorize';
import { validate } from '../../middlewares/validator';
import { getActor } from '../../utils/actor';
import * as svc from './shop.service';

const router = Router();
router.use(protect);

const h =
  (fn: (req: Request, res: Response) => Promise<any>, status = 200) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req, res);
      res.status(status).json({ status: 'success', data });
    } catch (e) {
      next(e);
    }
  };
const num = (v: any) => (v === undefined || v === '' ? undefined : Number(v));

router.get('/drugs', h(async (req) => svc.browseDrugs({
  search: req.query.search as string, kategori: req.query.kategori as string, page: num(req.query.page), limit: num(req.query.limit),
})));

router.get('/cart', authorize('pasien'), h(async (req) => svc.getCart(await getActor(req))));
router.put('/cart/items', authorize('pasien'),
  validate(z.object({ obat_id: z.string().min(1), jumlah: z.number().int().min(0).max(999) })),
  h(async (req) => svc.setCartItem(await getActor(req), req.body.obat_id, req.body.jumlah)));
router.delete('/cart', authorize('pasien'), h(async (req) => { await svc.clearCart(await getActor(req)); return null; }));

const checkoutSchema = z.object({
  alamat_pengiriman: z.string().min(5).max(500).optional(),
  catatan_pengiriman: z.string().max(300).optional(),
  metode_pembayaran_id: z.string().optional(),
  resep_id: z.string().optional(),
});
router.post('/checkout', authorize('pasien'), validate(checkoutSchema), h(async (req) => svc.checkout(await getActor(req), req.body), 201));
router.post('/prescriptions/:id/order', authorize('pasien'), validate(checkoutSchema.omit({ resep_id: true })),
  h(async (req) => svc.orderFromPrescription(await getActor(req), req.params.id, req.body), 201));

router.get('/orders', authorize('pasien', 'farmasi'), h(async (req) => svc.listOrders(req.query.status as string, num(req.query.page) ?? 1, Math.min(num(req.query.limit) ?? 20, 100))));
router.get('/orders/:id', authorize('pasien', 'farmasi'), h((req) => svc.getOrder(req.params.id)));
router.post('/orders/:id/cancel', authorize('pasien', 'farmasi'), validate(z.object({ reason: z.string().max(300).optional() })),
  h(async (req) => svc.cancelOrder(await getActor(req), req.params.id, req.body.reason)));
router.post('/orders/:id/advance', authorize('pasien', 'farmasi'), validate(z.object({ no_resi: z.string().max(60).optional() })),
  h(async (req) => svc.advanceOrder(await getActor(req), req.params.id, req.body.no_resi)));

export default router;
