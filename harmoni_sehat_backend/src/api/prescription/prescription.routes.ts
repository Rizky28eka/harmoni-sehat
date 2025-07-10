import { Router } from 'express';
import prescriptionController from './prescription.controller';
import { validate } from '../../middlewares/validator';
import { createPrescriptionSchema, updatePrescriptionSchema } from './prescription.validation';

const router = Router();

router.route('/')
  .post(validate(createPrescriptionSchema), prescriptionController.createPrescription)
  .get(prescriptionController.getAllPrescriptions);

router.route('/:id')
  .get(prescriptionController.getPrescriptionById)
  .put(validate(updatePrescriptionSchema), prescriptionController.updatePrescription)
  .delete(prescriptionController.deletePrescription);

export default router;