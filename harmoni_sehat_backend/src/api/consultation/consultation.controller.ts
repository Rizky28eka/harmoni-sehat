import { Request, Response, NextFunction } from 'express';
import consultationService from './consultation.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class ConsultationController {
  async createConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultation = await consultationService.createConsultation(req.body);
      res.status(201).json(new ApiResponse(201, consultation, 'Konsultasi berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const consultations = await consultationService.getAllConsultations();
      res.status(200).json(new ApiResponse(200, consultations, 'Daftar konsultasi berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getConsultationById(req: Request, res: Response, next: NextFunction) {
    try {
      const consultation = await consultationService.getConsultationById(req.params.id);
      res.status(200).json(new ApiResponse(200, consultation, 'Konsultasi berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultation = await consultationService.updateConsultation(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, consultation, 'Konsultasi berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      await consultationService.deleteConsultation(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Konsultasi berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new ConsultationController();