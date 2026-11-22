import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import mediaController from './media.controller';
import { validate } from '../../middlewares/validator';
import { createMediaSchema, updateMediaSchema } from './media.validation';

const router = Router();
router.use(accessPolicy("any", "any"));

import multer from 'multer';
import Media from '../../models/Media';
import { AppError } from '../../utils/AppError';
import { getActor } from '../../utils/actor';
import { getStorage } from '../../services/storage';

const ALLOWED: Record<string, { ext: string; magic: number[][] }> = {
  'image/jpeg': { ext: '.jpg', magic: [[0xff, 0xd8, 0xff]] },
  'image/png': { ext: '.png', magic: [[0x89, 0x50, 0x4e, 0x47]] },
  'image/webp': { ext: '.webp', magic: [[0x52, 0x49, 0x46, 0x46]] },
  'application/pdf': { ext: '.pdf', magic: [[0x25, 0x50, 0x44, 0x46]] },
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

// Files are validated by declared type AND magic bytes, then stored under a random name.
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) throw new AppError('File wajib diunggah (field "file")', 400);
    const rule = ALLOWED[file.mimetype];
    if (!rule || !rule.magic.some((m) => m.every((b, i) => file.buffer[i] === b))) {
      throw new AppError('Tipe file tidak didukung (JPG, PNG, WEBP, PDF)', 415);
    }
    const actor = await getActor(req);
    const stored = await getStorage().save({ buffer: file.buffer, ext: rule.ext, mime: file.mimetype });
    const media = await Media.create({
      model_type: String(req.body?.model_type ?? 'Upload').slice(0, 40),
      url: stored.url, mime_type: file.mimetype, size: file.size, uploaded_by: actor.userId,
    } as any);
    res.status(201).json({ status: 'success', data: media });
  } catch (e) { next(e); }
});

router.route('/')
  .post(validate(createMediaSchema), mediaController.createMedia)
  .get(mediaController.getAllMedia);

router.route('/:id')
  .get(mediaController.getMediaById)
  .put(validate(updateMediaSchema), mediaController.updateMedia)
  .delete(mediaController.deleteMedia);

export default router;