import { Router } from 'express';
import specializationController from './specialization.controller';
import { validate } from '../../middlewares/validator';
import { createSpecializationSchema, updateSpecializationSchema } from './specialization.validation';

const router = Router();

router.route('/')
  .post(validate(createSpecializationSchema), specializationController.createSpecialization)
  .get(specializationController.getAllSpecializations);

router.route('/:id')
  .get(specializationController.getSpecializationById)
  .put(validate(updateSpecializationSchema), specializationController.updateSpecialization)
  .delete(specializationController.deleteSpecialization);

export default router;