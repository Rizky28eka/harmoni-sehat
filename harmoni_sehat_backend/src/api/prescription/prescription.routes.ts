import { Router } from 'express';
import PrescriptionController from './prescription.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPrescriptionSchema, updatePrescriptionSchema } from './prescription.validation';

const router = Router();

// All prescription routes are protected
router.use(protect);

// Routes for doctors to create prescriptions
router.post('/', authorize('doctor'), validate(createPrescriptionSchema), PrescriptionController.createPrescription);

// Routes for patient/doctor to get their own prescriptions
router.get('/me', authorize('patient', 'doctor'), PrescriptionController.getMyPrescriptions);

// Routes for admin to get all prescriptions
router.get('/', authorize('admin'), PrescriptionController.getAllPrescriptions);

// Routes for specific prescription by ID
router.get('/:id', authorize('admin', 'patient', 'doctor'), PrescriptionController.getPrescriptionById);
router.put('/:id', authorize('admin', 'doctor', 'patient'), validate(updatePrescriptionSchema), PrescriptionController.updatePrescription);
router.delete('/:id', authorize('admin', 'doctor', 'patient'), PrescriptionController.deletePrescription);

export default router;
