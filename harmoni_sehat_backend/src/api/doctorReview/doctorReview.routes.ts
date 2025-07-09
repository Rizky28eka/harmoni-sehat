import { Router } from 'express';
import DoctorReviewController from './doctorReview.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDoctorReviewSchema, updateDoctorReviewSchema } from './doctorReview.validation';

const router = Router();

// All doctor review routes are protected
router.use(protect);

// Routes for creating reviews (only by patient)
router.post('/', authorize('patient'), validate(createDoctorReviewSchema), DoctorReviewController.createDoctorReview);

// Routes for getting all reviews (publicly accessible by authenticated users)
router.get('/', DoctorReviewController.getAllDoctorReviews);
router.get('/doctor/:doctorId', DoctorReviewController.getDoctorReviewsByDoctorId);

// Routes for specific review by ID
router.get('/:id', authorize('patient', 'admin', 'doctor'), DoctorReviewController.getDoctorReviewById);
router.put('/:id', authorize('patient', 'admin'), validate(updateDoctorReviewSchema), DoctorReviewController.updateDoctorReview);
router.delete('/:id', authorize('patient', 'admin'), DoctorReviewController.deleteDoctorReview);

export default router;
