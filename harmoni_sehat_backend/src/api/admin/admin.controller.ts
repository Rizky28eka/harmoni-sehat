import { Request, Response, NextFunction } from 'express';
import adminService from './admin.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await adminService.createAdmin(req.body);
      res.status(201).json(new ApiResponse(201, admin, 'Admin berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await adminService.getAllAdmins();
      res.status(200).json(new ApiResponse(200, admins, 'Daftar admin berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await adminService.getAdminById(req.params.id);
      res.status(200).json(new ApiResponse(200, admin, 'Admin berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await adminService.updateAdmin(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, admin, 'Data admin berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteAdmin(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Admin berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new AdminController();