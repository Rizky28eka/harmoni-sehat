import { Request, Response, NextFunction } from 'express';
import userService from './user.service';
import APIFeatures from '../../utils/apiFeatures';
import User from '../../models/User';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await userService.createUser(email, password);
      res.status(201).json(new ApiResponse(201, user, 'User berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const features = new APIFeatures(User.find().populate({ path: 'role', select: 'nama_peran' }) as any, req.query)
        .filter()
        .search(['email', 'nama']) // Assuming 'nama' field exists in User or related populated models
        .sort()
        .limitFields()
        .paginate();

      const users = await features.query.lean();

      // Count total documents for pagination metadata
      const totalUsers = await User.countDocuments(features.getConditions());

      res.status(200).json(new ApiResponse(200, {
        data: users,
        total: totalUsers,
        page: features.queryString.page ? parseInt(features.queryString.page as string, 10) : 1,
        limit: features.queryString.limit ? parseInt(features.queryString.limit as string, 10) : 10,
      }, 'Users berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id)
        .select('email is_active role createdAt updatedAt')
        .populate({ path: 'role', select: 'nama_peran' })
        .lean();

      if (!user) {
        throw new AppError('User tidak ditemukan', 404);
      }
      res.status(200).json(new ApiResponse(200, user, 'User berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, user, 'User berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'User berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new UserController();