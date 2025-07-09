import { Router } from 'express';
import DoctorController from './doctor.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDoctorSchema, updateDoctorSchema } from './doctor.validation';

const router = Router();

// All doctor routes are protected
router.use(protect);

// Route for a logged-in user to create their own doctor profile
router.post('/', authorize('doctor'), validate(createDoctorSchema), DoctorController.createDoctor);

// Route for a logged-in user to get their own doctor profile
router.get('/me', authorize('doctor'), DoctorController.getMyDoctorProfile);

// Routes for admin/patient/other doctors to get all doctors
router.get('/', authorize('admin', 'patient', 'doctor'), DoctorController.getAllDoctors);

// Routes for specific doctor by ID
router.get('/:id', authorize('admin', 'patient', 'doctor'), DoctorController.getDoctorById);
router.put('/:id', authorize('admin', 'doctor'), validate(updateDoctorSchema), DoctorController.updateDoctor);
router.delete('/:id', authorize('admin'), DoctorController.deleteDoctor);

export default router;
