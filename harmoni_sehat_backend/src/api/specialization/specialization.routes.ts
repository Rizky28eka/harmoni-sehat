import { Router } from 'express';
import SpecializationController from './specialization.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createSpecializationSchema, updateSpecializationSchema } from './specialization.validation';

const router = Router();

// Routes that can be accessed by any authenticated user
router.use(protect);
router.get('/', SpecializationController.getAllSpecializations);
router.get('/:id', SpecializationController.getSpecializationById);

// Routes restricted to admin
router.use(authorize('admin'));
router.post('/', validate(createSpecializationSchema), SpecializationController.createSpecialization);
router.put('/:id', validate(updateSpecializationSchema), SpecializationController.updateSpecialization);
router.delete('/:id', SpecializationController.deleteSpecialization);

export default router;
