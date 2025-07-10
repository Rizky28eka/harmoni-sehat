import { Request, Response, NextFunction } from 'express';
import clinicService from './clinic.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class ClinicController {
  async createClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.createClinic(req.body);
      res.status(201).json(new ApiResponse(201, clinic, 'Klinik berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllClinics(req: Request, res: Response, next: NextFunction) {
    try {
      const clinics = await clinicService.getAllClinics();
      res.status(200).json(new ApiResponse(200, clinics, 'Daftar klinik berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getClinicById(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.getClinicById(req.params.id);
      res.status(200).json(new ApiResponse(200, clinic, 'Klinik berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.updateClinic(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, clinic, 'Data klinik berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteClinic(req: Request, res: Response, next: NextFunction) {
    try {
      await clinicService.deleteClinic(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Klinik berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new ClinicController();