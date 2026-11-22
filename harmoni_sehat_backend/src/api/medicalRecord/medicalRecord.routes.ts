import { requireVerifiedProfessional } from '../../middlewares/verified';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import medicalRecordController from './medicalRecord.controller';
import { validate } from '../../middlewares/validator';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from './medicalRecord.validation';

const router = Router();
router.use(accessPolicy(["pasien", "dokter"], ["dokter"]));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

router.route('/')
  .post(validate(createMedicalRecordSchema), medicalRecordController.createMedicalRecord)
  .get(medicalRecordController.getAllMedicalRecords);

router.route('/:id')
  .get(medicalRecordController.getMedicalRecordById)
  .put(validate(updateMedicalRecordSchema), medicalRecordController.updateMedicalRecord)
  .delete(medicalRecordController.deleteMedicalRecord);

export default router;