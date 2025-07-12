import { Request, Response, NextFunction } from 'express';
import doctorReviewService from './doctorReview.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DoctorReviewController {
  async createDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorReview = await doctorReviewService.createDoctorReview(req.body);
      res.status(201).json(new ApiResponse(201, doctorReview, 'Review dokter berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDoctorReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorReviews = await doctorReviewService.getAllDoctorReviews();
      res.status(200).json(new ApiResponse(200, doctorReviews, 'Daftar review dokter berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDoctorReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorReview = await doctorReviewService.getDoctorReviewById(req.params.id);
      res.status(200).json(new ApiResponse(200, doctorReview, 'Review dokter berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorReview = await doctorReviewService.updateDoctorReview(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, doctorReview, 'Review dokter berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async replyToReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { replyText } = req.body;
      const doctorReview = await doctorReviewService.replyToReview(req.params.id, replyText);
      res.status(200).json(new ApiResponse(200, doctorReview, 'Balasan review berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDoctorReview(req: Request, res: Response, next: NextFunction) {
    try {
      await doctorReviewService.deleteDoctorReview(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Review dokter berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DoctorReviewController();