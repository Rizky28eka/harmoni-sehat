import { Request, Response, NextFunction } from 'express';
import refreshTokenService from './refreshToken.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class RefreshTokenController {
  async createRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = await refreshTokenService.createRefreshToken(req.body);
      res.status(201).json(new ApiResponse(201, refreshToken, 'Refresh Token berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllRefreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokens = await refreshTokenService.getAllRefreshTokens();
      res.status(200).json(new ApiResponse(200, refreshTokens, 'Daftar Refresh Token berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getRefreshTokenById(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = await refreshTokenService.getRefreshTokenById(req.params.id);
      res.status(200).json(new ApiResponse(200, refreshToken, 'Refresh Token berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = await refreshTokenService.updateRefreshToken(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, refreshToken, 'Refresh Token berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      await refreshTokenService.deleteRefreshToken(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Refresh Token berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new RefreshTokenController();