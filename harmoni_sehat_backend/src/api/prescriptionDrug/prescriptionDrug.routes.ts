import { Router } from 'express';
import prescriptionDrugController from './prescriptionDrug.controller';
import { validate } from '../../middlewares/validator';
import { createPrescriptionDrugSchema, updatePrescriptionDrugSchema } from './prescriptionDrug.validation';

const router = Router();

router.route('/')
  .post(validate(createPrescriptionDrugSchema), prescriptionDrugController.createPrescriptionDrug)
  .get(prescriptionDrugController.getAllPrescriptionDrugs);

router.route('/:id')
  .get(prescriptionDrugController.getPrescriptionDrugById)
  .put(validate(updatePrescriptionDrugSchema), prescriptionDrugController.updatePrescriptionDrug)
  .delete(prescriptionDrugController.deletePrescriptionDrug);

export default router;