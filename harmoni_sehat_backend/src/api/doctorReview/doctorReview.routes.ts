import { Router } from 'express';
import doctorReviewController from './doctorReview.controller';
import { validate } from '../../middlewares/validator';
import { createDoctorReviewSchema, updateDoctorReviewSchema } from './doctorReview.validation';

const router = Router();

router.route('/')
  .post(validate(createDoctorReviewSchema), doctorReviewController.createDoctorReview)
  .get(doctorReviewController.getAllDoctorReviews);

router.route('/:id')
  .get(doctorReviewController.getDoctorReviewById)
  .put(validate(updateDoctorReviewSchema), doctorReviewController.updateDoctorReview)
  .delete(doctorReviewController.deleteDoctorReview);

export default router;