import { Request, Response, NextFunction } from 'express';
import userRoleService from './userRole.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class UserRoleController {
  async createUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, peran_id } = req.body;
      const userRole = await userRoleService.createUserRole(user_id, peran_id);
      res.status(201).json(new ApiResponse(201, userRole, 'User Role berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = await userRoleService.getAllUserRoles();
      res.status(200).json(new ApiResponse(200, userRoles, 'Daftar User Role berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getUserRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = await userRoleService.getUserRoleById(req.params.id);
      res.status(200).json(new ApiResponse(200, userRole, 'User Role berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = await userRoleService.updateUserRole(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, userRole, 'User Role berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      await userRoleService.deleteUserRole(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'User Role berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new UserRoleController();