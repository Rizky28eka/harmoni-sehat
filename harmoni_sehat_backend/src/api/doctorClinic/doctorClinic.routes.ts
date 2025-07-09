import { Router } from 'express';
import DoctorClinicController from './doctorClinic.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDoctorClinicSchema, updateDoctorClinicSchema } from './doctorClinic.validation';

const router = Router();

// All doctor clinic routes are protected
router.use(protect);

// Routes for doctors to manage their own clinic associations
router.post('/', authorize('doctor'), validate(createDoctorClinicSchema), DoctorClinicController.createDoctorClinic);
router.get('/doctor/:doctorId', authorize('doctor', 'admin'), DoctorClinicController.getDoctorClinicsByDoctorId);

// Routes for admin to get all associations
router.get('/', authorize('admin'), DoctorClinicController.getAllDoctorClinics);

// Routes for specific association by ID
router.get('/:id', authorize('admin', 'doctor'), DoctorClinicController.getDoctorClinicById);
router.put('/:id', authorize('admin', 'doctor'), validate(updateDoctorClinicSchema), DoctorClinicController.updateDoctorClinic);
router.delete('/:id', authorize('admin', 'doctor'), DoctorClinicController.deleteDoctorClinic);

export default router;
