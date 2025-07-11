import { Request, Response, NextFunction } from 'express';
import doctorService from './doctor.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DoctorController {
  async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming req.user.id contains the user_id from the authenticated user
      const userId = (req as any).user.id;
      const doctorData = { ...req.body, user_id: userId };
      const doctor = await doctorService.createDoctor(doctorData);
      res.status(201).json(new ApiResponse(201, doctor, 'Dokter berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await doctorService.getAllDoctors();
      res.status(200).json(new ApiResponse(200, doctors, 'Daftar dokter berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      res.status(200).json(new ApiResponse(200, doctor, 'Dokter berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, doctor, 'Data dokter berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      await doctorService.deleteDoctor(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Dokter berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DoctorController();