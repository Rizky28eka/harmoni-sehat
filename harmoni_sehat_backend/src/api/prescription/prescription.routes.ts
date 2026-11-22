import { requireVerifiedProfessional } from '../../middlewares/verified';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import prescriptionController from './prescription.controller';
import { validate } from '../../middlewares/validator';
import { createPrescriptionSchema, updatePrescriptionSchema } from './prescription.validation';

const router = Router();
router.use(accessPolicy("any", ["dokter"]));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

router.route('/')
  .post(validate(createPrescriptionSchema), prescriptionController.createPrescription)
  .get(prescriptionController.getAllPrescriptions);

router.route('/:id')
  .get(prescriptionController.getPrescriptionById)
  .put(validate(updatePrescriptionSchema), prescriptionController.updatePrescription)
  .delete(prescriptionController.deletePrescription);

export default router;