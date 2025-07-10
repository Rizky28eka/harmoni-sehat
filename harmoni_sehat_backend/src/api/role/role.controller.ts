import { Request, Response, NextFunction } from 'express';
import roleService from './role.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class RoleController {
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama_peran } = req.body;
      const role = await roleService.createRole(nama_peran);
      res.status(201).json(new ApiResponse(201, role, 'Role berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json(new ApiResponse(200, roles, 'Roles berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.status(200).json(new ApiResponse(200, role, 'Role berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama_peran } = req.body;
      const role = await roleService.updateRole(req.params.id, nama_peran);
      res.status(200).json(new ApiResponse(200, role, 'Role berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      await roleService.deleteRole(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Role berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new RoleController();