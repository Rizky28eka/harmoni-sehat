import { Router } from 'express';
import mediaController from './media.controller';
import { validate } from '../../middlewares/validator';
import { createMediaSchema, updateMediaSchema } from './media.validation';

const router = Router();

router.route('/')
  .post(validate(createMediaSchema), mediaController.createMedia)
  .get(mediaController.getAllMedia);

router.route('/:id')
  .get(mediaController.getMediaById)
  .put(validate(updateMediaSchema), mediaController.updateMedia)
  .delete(mediaController.deleteMedia);

export default router;