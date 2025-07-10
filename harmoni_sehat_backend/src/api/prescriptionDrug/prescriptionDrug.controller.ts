import { Request, Response, NextFunction } from 'express';
import prescriptionDrugService from './prescriptionDrug.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PrescriptionDrugController {
  async createPrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrug = await prescriptionDrugService.createPrescriptionDrug(req.body);
      res.status(201).json(new ApiResponse(201, prescriptionDrug, 'Obat resep berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPrescriptionDrugs(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrugs = await prescriptionDrugService.getAllPrescriptionDrugs();
      res.status(200).json(new ApiResponse(200, prescriptionDrugs, 'Daftar obat resep berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPrescriptionDrugById(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrug = await prescriptionDrugService.getPrescriptionDrugById(req.params.id);
      res.status(200).json(new ApiResponse(200, prescriptionDrug, 'Obat resep berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrug = await prescriptionDrugService.updatePrescriptionDrug(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, prescriptionDrug, 'Obat resep berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      await prescriptionDrugService.deletePrescriptionDrug(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Obat resep berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PrescriptionDrugController();