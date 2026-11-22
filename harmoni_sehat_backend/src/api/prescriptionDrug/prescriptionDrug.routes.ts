import { requireVerifiedProfessional } from '../../middlewares/verified';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import prescriptionDrugController from './prescriptionDrug.controller';
import { validate } from '../../middlewares/validator';
import { createPrescriptionDrugSchema, updatePrescriptionDrugSchema } from './prescriptionDrug.validation';

const router = Router();
router.use(accessPolicy("any", ["dokter"]));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

router.route('/')
  .post(validate(createPrescriptionDrugSchema), prescriptionDrugController.createPrescriptionDrug)
  .get(prescriptionDrugController.getAllPrescriptionDrugs);

router.route('/:id')
  .get(prescriptionDrugController.getPrescriptionDrugById)
  .put(validate(updatePrescriptionDrugSchema), prescriptionDrugController.updatePrescriptionDrug)
  .delete(prescriptionDrugController.deletePrescriptionDrug);

export default router;