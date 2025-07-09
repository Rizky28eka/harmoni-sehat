import { Request, Response, NextFunction } from 'express';
import DoctorReviewService from './doctorReview.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDoctorReviewResponseDto } from './doctorReview.interface';
import { CreateDoctorReviewInput, UpdateDoctorReviewInput } from './doctorReview.validation';
import Patient from '../../models/Patient';

class DoctorReviewController {
  async createDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewData: CreateDoctorReviewInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newReview = await DoctorReviewService.createDoctorReview(userId.toString(), reviewData);
      res.status(201).json(new ApiResponse(201, toDoctorReviewResponseDto(newReview), 'Doctor review created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctorReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await DoctorReviewService.getAllDoctorReviews();
      res.status(200).json(new ApiResponse(200, reviews.map(toDoctorReviewResponseDto), 'Doctor reviews fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDoctorReviewsByDoctorId(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.params.doctorId;
      const reviews = await DoctorReviewService.getDoctorReviewsByDoctorId(doctorId);
      res.status(200).json(new ApiResponse(200, reviews.map(toDoctorReviewResponseDto), 'Doctor reviews fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDoctorReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await DoctorReviewService.getDoctorReviewById(req.params.id);

      // Ownership authorization: Patient can only access their own review
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || review?.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this doctor review.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toDoctorReviewResponseDto(review!), 'Doctor review fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewData: UpdateDoctorReviewInput = req.body;
      const reviewId = req.params.id; // ID of the doctor review to update

      // Get the review first to check ownership
      const existingReview = await DoctorReviewService.getDoctorReviewById(reviewId);
      if (!existingReview) {
        return next(new AppError('Doctor Review not found', 404));
      }

      // Ownership authorization: Patient can only update their own review
      if (req.user?.roles?.includes('patient') && existingReview.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this doctor review.', 403));
      }

      const updatedReview = await DoctorReviewService.updateDoctorReview(reviewId, reviewData);
      res.status(200).json(new ApiResponse(200, toDoctorReviewResponseDto(updatedReview!), 'Doctor review updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id; // ID of the doctor review to delete

      // Get the review first to check ownership
      const existingReview = await DoctorReviewService.getDoctorReviewById(reviewId);
      if (!existingReview) {
        return next(new AppError('Doctor Review not found', 404));
      }

      // Ownership authorization: Patient can only delete their own review
      if (req.user?.roles?.includes('patient') && existingReview.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this doctor review.', 403));
      }

      await DoctorReviewService.deleteDoctorReview(reviewId);
      res.status(204).json(new ApiResponse(204, null, 'Doctor review deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DoctorReviewController();
