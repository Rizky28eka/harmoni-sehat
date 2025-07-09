import { Router } from 'express';
import MedicalRecordController from './medicalRecord.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from './medicalRecord.validation';

const router = Router();

// All medical record routes are protected
router.use(protect);

// Route for a patient to get their own medical record
router.get('/my-record', MedicalRecordController.getMyMedicalRecord);

router.post('/', authorize('patient'), validate(createMedicalRecordSchema), MedicalRecordController.createMedicalRecord);

// Routes for specific record by ID.
// NOTE: Ownership authorization will be handled in controller/service for patient role
router.get('/:id', authorize('admin', 'doctor', 'patient'), MedicalRecordController.getMedicalRecordById);
router.put('/:id', authorize('admin', 'doctor', 'patient'), validate(updateMedicalRecordSchema), MedicalRecordController.updateMedicalRecord);
router.delete('/:id', authorize('admin'), MedicalRecordController.deleteMedicalRecord);

export default router;
