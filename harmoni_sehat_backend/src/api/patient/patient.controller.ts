import { Request, Response, NextFunction } from 'express';
import patientService from './patient.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PatientController {
  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming req.user.id contains the user_id from the authenticated user
      const userId = (req as any).user.id;
      const patientData = { ...req.body, user_id: userId };
      const patient = await patientService.createPatient(patientData);
      res.status(201).json(new ApiResponse(201, patient, 'Pasien berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await patientService.getAllPatients();
      res.status(200).json(new ApiResponse(200, patients, 'Daftar pasien berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      res.status(200).json(new ApiResponse(200, patient, 'Pasien berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, patient, 'Data pasien berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      await patientService.deletePatient(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Pasien berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PatientController();