import { Request, Response, NextFunction } from 'express';
import AdminService from './admin.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toAdminResponseDto } from './admin.interface';
import { CreateAdminInput, UpdateAdminInput } from './admin.validation';

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminData: CreateAdminInput = req.body;
      const newAdmin = await AdminService.createAdmin(adminData);
      res.status(201).json(new ApiResponse(201, toAdminResponseDto(newAdmin), 'Admin created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await AdminService.getAllAdmins();
      res.status(200).json(new ApiResponse(200, admins.map(toAdminResponseDto), 'Admins fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.getAdminById(req.params.id);

      // Ownership authorization: Admin can only access their own profile
      if (req.user?._id.toString() !== admin?.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access this admin profile.', 403));
      }

      res.status(200).json(new ApiResponse(200, toAdminResponseDto(admin!), 'Admin fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyAdminProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const admin = await AdminService.getMyAdminProfile(userId.toString());
      res.status(200).json(new ApiResponse(200, toAdminResponseDto(admin!), 'My admin profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminData: UpdateAdminInput = req.body;
      const adminId = req.params.id; // ID of the admin to update

      // Get the admin first to check ownership
      const existingAdmin = await AdminService.getAdminById(adminId);
      if (!existingAdmin) {
        return next(new AppError('Admin not found', 404));
      }

      // Ownership authorization: Admin can only update their own profile
      if (req.user?._id.toString() !== existingAdmin.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to update this admin profile.', 403));
      }

      const updatedAdmin = await AdminService.updateAdmin(adminId, adminData);
      res.status(200).json(new ApiResponse(200, toAdminResponseDto(updatedAdmin!), 'Admin updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.params.id; // ID of the admin to delete

      // Get the admin first to check ownership
      const existingAdmin = await AdminService.getAdminById(adminId);
      if (!existingAdmin) {
        return next(new AppError('Admin not found', 404));
      }

      // Ownership authorization: Admin can only delete their own profile
      if (req.user?._id.toString() !== existingAdmin.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to delete this admin profile.', 403));
      }

      await AdminService.deleteAdmin(adminId);
      res.status(204).json(new ApiResponse(204, null, 'Admin deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
