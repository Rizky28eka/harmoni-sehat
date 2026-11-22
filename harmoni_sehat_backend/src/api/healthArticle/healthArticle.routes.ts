import { requireVerifiedProfessional } from '../../middlewares/verified';
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { validate } from '../../middlewares/validator';
import HealthArticle from '../../models/HealthArticle';
import { AppError } from '../../utils/AppError';

const router = Router();
router.use(accessPolicy('public', ['dokter', 'admin']));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

const uniqueSlug = async (base: string, excludeId?: string) => {
  let slug = base || 'artikel';
  let n = 1;
  while (await HealthArticle.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) slug = `${base}-${++n}`;
  return slug;
};

const h = (fn: (req: Request, res: Response) => Promise<any>, status = 200) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(status).json({ status: 'success', data: await fn(req, res) }); } catch (e) { next(e); }
  };

const articleSchema = z.object({
  judul: z.string().min(3).max(200),
  konten: z.string().min(10),
  status_publikasi: z.enum(['draft', 'published', 'archived']).optional(),
});

// Public list: published articles only.
router.get('/', h(async (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter: Record<string, any> = { status_publikasi: 'published' };
  if (req.query.search) filter.judul = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 64), $options: 'i' };
  const [data, total] = await Promise.all([
    HealthArticle.find(filter).select('-konten').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    HealthArticle.countDocuments(filter),
  ]);
  return { data, total, page, limit };
}));

router.get('/:idOrSlug', h(async (req) => {
  const { idOrSlug } = req.params;
  const q = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const a = await HealthArticle.findOne(q).lean();
  if (!a || a.status_publikasi !== 'published') throw new AppError('Artikel tidak ditemukan', 404);
  return a;
}));

router.post('/', validate(articleSchema), h(async (req) => {
  const slug = await uniqueSlug(slugify(req.body.judul));
  return HealthArticle.create({ ...req.body, slug, penulis_id: (req as any).user._id });
}, 201));

const ownOrAdmin = async (req: Request) => {
  const a = await HealthArticle.findById(req.params.idOrSlug);
  if (!a) throw new AppError('Artikel tidak ditemukan', 404);
  const role = (req as any).userRole;
  if (role !== 'admin' && role !== 'superadmin' && String(a.penulis_id) !== String((req as any).user._id)) {
    throw new AppError('Anda hanya dapat mengubah artikel milik sendiri', 403);
  }
  return a;
};

router.put('/:idOrSlug', validate(articleSchema.partial()), h(async (req) => {
  const a = await ownOrAdmin(req);
  Object.assign(a, req.body);
  if (req.body.judul) a.slug = await uniqueSlug(slugify(req.body.judul), String(a._id));
  return a.save();
}));

router.delete('/:idOrSlug', h(async (req) => {
  const a = await ownOrAdmin(req);
  await a.deleteOne();
  return null;
}));

export default router;
