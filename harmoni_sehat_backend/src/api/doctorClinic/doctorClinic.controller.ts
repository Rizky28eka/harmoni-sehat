import { Request, Response, NextFunction } from 'express';
import doctorClinicService from './doctorClinic.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DoctorClinicController {
  async createDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinic = await doctorClinicService.createDoctorClinic(req.body);
      res.status(201).json(new ApiResponse(201, doctorClinic, 'Dokter Klinik berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDoctorClinics(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinics = await doctorClinicService.getAllDoctorClinics();
      res.status(200).json(new ApiResponse(200, doctorClinics, 'Daftar Dokter Klinik berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDoctorClinicById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinic = await doctorClinicService.getDoctorClinicById(req.params.id);
      res.status(200).json(new ApiResponse(200, doctorClinic, 'Dokter Klinik berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinic = await doctorClinicService.updateDoctorClinic(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, doctorClinic, 'Dokter Klinik berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      await doctorClinicService.deleteDoctorClinic(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Dokter Klinik berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DoctorClinicController();