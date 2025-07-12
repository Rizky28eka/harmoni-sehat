import { Router } from 'express';
import doctorReviewController from './doctorReview.controller';
import { validate } from '../../middlewares/validator';
import { createDoctorReviewSchema, updateDoctorReviewSchema } from './doctorReview.validation';
import protect from '../../middlewares/protect';
import authorize from '../../middlewares/authorize';

const router = Router();

router.route('/')
  .post(protect, validate(createDoctorReviewSchema), doctorReviewController.createDoctorReview)
  .get(doctorReviewController.getAllDoctorReviews);

router.route('/:id')
  .get(doctorReviewController.getDoctorReviewById)
  .put(protect, validate(updateDoctorReviewSchema), doctorReviewController.updateDoctorReview)
  .delete(protect, authorize('admin'), doctorReviewController.deleteDoctorReview);

router.post('/:id/reply', protect, authorize('dokter'), doctorReviewController.replyToReview);

export default router;