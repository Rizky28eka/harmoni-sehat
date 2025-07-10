import { Request, Response, NextFunction } from 'express';
import prescriptionService from './prescription.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PrescriptionController {
  async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.createPrescription(req.body);
      res.status(201).json(new ApiResponse(201, prescription, 'Resep berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptions = await prescriptionService.getAllPrescriptions();
      res.status(200).json(new ApiResponse(200, prescriptions, 'Daftar resep berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPrescriptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.getPrescriptionById(req.params.id);
      res.status(200).json(new ApiResponse(200, prescription, 'Resep berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, prescription, 'Resep berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      await prescriptionService.deletePrescription(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Resep berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PrescriptionController();