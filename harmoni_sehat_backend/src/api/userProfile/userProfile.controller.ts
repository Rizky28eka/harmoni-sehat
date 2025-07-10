import { Request, Response, NextFunction } from 'express';
import userProfileService from './userProfile.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class UserProfileController {
  async createUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = await userProfileService.createUserProfile(req.body);
      res.status(201).json(new ApiResponse(201, userProfile, 'Profil pengguna berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllUserProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfiles = await userProfileService.getAllUserProfiles();
      res.status(200).json(new ApiResponse(200, userProfiles, 'Daftar profil pengguna berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getUserProfileById(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = await userProfileService.getUserProfileById(req.params.id);
      res.status(200).json(new ApiResponse(200, userProfile, 'Profil pengguna berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = await userProfileService.updateUserProfile(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, userProfile, 'Profil pengguna berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      await userProfileService.deleteUserProfile(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Profil pengguna berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new UserProfileController();