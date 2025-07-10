import { Request, Response, NextFunction } from 'express';
import drugService from './drug.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DrugController {
  async createDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await drugService.createDrug(req.body);
      res.status(201).json(new ApiResponse(201, drug, 'Obat berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDrugs(req: Request, res: Response, next: NextFunction) {
    try {
      const drugs = await drugService.getAllDrugs();
      res.status(200).json(new ApiResponse(200, drugs, 'Daftar obat berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDrugById(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await drugService.getDrugById(req.params.id);
      res.status(200).json(new ApiResponse(200, drug, 'Obat berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await drugService.updateDrug(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, drug, 'Obat berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDrug(req: Request, res: Response, next: NextFunction) {
    try {
      await drugService.deleteDrug(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Obat berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DrugController();