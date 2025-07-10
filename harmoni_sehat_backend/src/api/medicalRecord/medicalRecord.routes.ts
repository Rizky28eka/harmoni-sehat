import { Router } from 'express';
import medicalRecordController from './medicalRecord.controller';
import { validate } from '../../middlewares/validator';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from './medicalRecord.validation';

const router = Router();

router.route('/')
  .post(validate(createMedicalRecordSchema), medicalRecordController.createMedicalRecord)
  .get(medicalRecordController.getAllMedicalRecords);

router.route('/:id')
  .get(medicalRecordController.getMedicalRecordById)
  .put(validate(updateMedicalRecordSchema), medicalRecordController.updateMedicalRecord)
  .delete(medicalRecordController.deleteMedicalRecord);

export default router;