import { Router } from 'express';
import MediaController from './media.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createMediaSchema, updateMediaSchema } from './media.validation';

const router = Router();

// All media routes are protected
router.use(protect);

// Routes for creating media (restricted by ownership in controller)
router.post('/', authorize('admin', 'doctor', 'patient'), validate(createMediaSchema), MediaController.createMedia);

// Routes for getting all media (admin only)
router.get('/', authorize('admin'), MediaController.getAllMedia);

// Routes for specific media by ID
router.get('/:id', authorize('admin', 'doctor', 'patient'), MediaController.getMediaById);
router.put('/:id', authorize('admin', 'doctor', 'patient'), validate(updateMediaSchema), MediaController.updateMedia);
router.delete('/:id', authorize('admin', 'doctor', 'patient'), MediaController.deleteMedia);

// Route to get media by model type and ID
router.get('/model/:modelType/:modelId', authorize('admin', 'doctor', 'patient'), MediaController.getMediaByModel);

export default router;
