import { Request, Response, NextFunction } from 'express';
import pharmacistService from './pharmacist.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PharmacistController {
  async createPharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacist = await pharmacistService.createPharmacist(req.body);
      res.status(201).json(new ApiResponse(201, pharmacist, 'Apoteker berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPharmacists(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacists = await pharmacistService.getAllPharmacists();
      res.status(200).json(new ApiResponse(200, pharmacists, 'Daftar apoteker berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPharmacistById(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacist = await pharmacistService.getPharmacistById(req.params.id);
      res.status(200).json(new ApiResponse(200, pharmacist, 'Apoteker berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacist = await pharmacistService.updatePharmacist(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, pharmacist, 'Data apoteker berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      await pharmacistService.deletePharmacist(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Apoteker berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PharmacistController();