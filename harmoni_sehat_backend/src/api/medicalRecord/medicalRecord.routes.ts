import { Router } from 'express';
import MedicalRecordController from './medicalRecord.controller';
import validate from '../../middlewares/validator';

const router = Router();

router.get('/', MedicalRecordController.getAllMedicalRecords);
router.get('/:id', MedicalRecordController.getMedicalRecordById);
router.post('/', validate({}), MedicalRecordController.createMedicalRecord); // Add actual schema here
router.put('/:id', validate({}), MedicalRecordController.updateMedicalRecord); // Add actual schema here
router.delete('/:id', MedicalRecordController.deleteMedicalRecord);

export default router;
