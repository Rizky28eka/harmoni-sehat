import { Request, Response, NextFunction } from 'express';
import specializationService from './specialization.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class SpecializationController {
  async createSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama, deskripsi } = req.body;
      const specialization = await specializationService.createSpecialization(nama, deskripsi);
      res.status(201).json(new ApiResponse(201, specialization, 'Spesialisasi berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllSpecializations(req: Request, res: Response, next: NextFunction) {
    try {
      const specializations = await specializationService.getAllSpecializations();
      res.status(200).json(new ApiResponse(200, specializations, 'Daftar spesialisasi berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getSpecializationById(req: Request, res: Response, next: NextFunction) {
    try {
      const specialization = await specializationService.getSpecializationById(req.params.id);
      res.status(200).json(new ApiResponse(200, specialization, 'Spesialisasi berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const specialization = await specializationService.updateSpecialization(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, specialization, 'Spesialisasi berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      await specializationService.deleteSpecialization(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Spesialisasi berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new SpecializationController();