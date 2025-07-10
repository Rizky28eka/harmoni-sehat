import { Router } from 'express';
import consultationController from './consultation.controller';
import { validate } from '../../middlewares/validator';
import { createConsultationSchema, updateConsultationSchema } from './consultation.validation';

const router = Router();

router.route('/')
  .post(validate(createConsultationSchema), consultationController.createConsultation)
  .get(consultationController.getAllConsultations);

router.route('/:id')
  .get(consultationController.getConsultationById)
  .put(validate(updateConsultationSchema), consultationController.updateConsultation)
  .delete(consultationController.deleteConsultation);

export default router;