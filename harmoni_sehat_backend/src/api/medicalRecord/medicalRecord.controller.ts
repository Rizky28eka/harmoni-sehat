import { Request, Response, NextFunction } from 'express';
import medicalRecordService from './medicalRecord.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class MedicalRecordController {
  async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecord = await medicalRecordService.createMedicalRecord(req.body);
      res.status(201).json(new ApiResponse(201, medicalRecord, 'Rekam medis berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecords = await medicalRecordService.getAllMedicalRecords();
      res.status(200).json(new ApiResponse(200, medicalRecords, 'Daftar rekam medis berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecord = await medicalRecordService.getMedicalRecordById(req.params.id);
      res.status(200).json(new ApiResponse(200, medicalRecord, 'Rekam medis berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecord = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, medicalRecord, 'Rekam medis berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      await medicalRecordService.deleteMedicalRecord(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Rekam medis berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new MedicalRecordController();