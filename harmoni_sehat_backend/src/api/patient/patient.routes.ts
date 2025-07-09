import { Router } from 'express';
import PatientController from './patient.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPatientSchema, updatePatientSchema } from './patient.validation';

const router = Router();

// All patient routes are protected
router.use(protect);

// Route for a logged-in user to create their own patient profile
router.post('/', validate(createPatientSchema), PatientController.createPatient);

// Route for a logged-in user to get their own patient profile
router.get('/me', PatientController.getMyPatientProfile);

// Routes for admin/doctor to get all patients
router.get('/', authorize('admin', 'doctor'), PatientController.getAllPatients);

// Routes for specific patient by ID
// NOTE: Ownership authorization will be handled in controller/service for patient role
router.get('/:id', authorize('admin', 'doctor', 'patient'), PatientController.getPatientById);
router.put('/:id', authorize('admin', 'patient'), validate(updatePatientSchema), PatientController.updatePatient);
router.delete('/:id', authorize('admin'), PatientController.deletePatient);

export default router;
