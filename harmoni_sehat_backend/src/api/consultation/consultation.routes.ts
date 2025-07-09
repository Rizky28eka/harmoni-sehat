import { Router } from 'express';
import ConsultationController from './consultation.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createConsultationSchema, updateConsultationSchema } from './consultation.validation';

const router = Router();

// All consultation routes are protected
router.use(protect);

// Routes for patient/doctor to manage their own consultations
router.post('/', authorize('patient'), validate(createConsultationSchema), ConsultationController.createConsultation);
router.get('/me', authorize('patient', 'doctor'), ConsultationController.getMyConsultations);

// Routes for admin to get all consultations
router.get('/', authorize('admin'), ConsultationController.getAllConsultations);

// Routes for specific consultation by ID
router.get('/:id', authorize('admin', 'patient', 'doctor'), ConsultationController.getConsultationById);
router.put('/:id', authorize('admin', 'patient', 'doctor'), validate(updateConsultationSchema), ConsultationController.updateConsultation);
router.delete('/:id', authorize('admin', 'patient', 'doctor'), ConsultationController.deleteConsultation);

export default router;
