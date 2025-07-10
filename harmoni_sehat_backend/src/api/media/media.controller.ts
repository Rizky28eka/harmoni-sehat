import { Request, Response, NextFunction } from 'express';
import mediaService from './media.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class MediaController {
  async createMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await mediaService.createMedia(req.body);
      res.status(201).json(new ApiResponse(201, media, 'Media berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await mediaService.getAllMedia();
      res.status(200).json(new ApiResponse(200, media, 'Daftar media berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getMediaById(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await mediaService.getMediaById(req.params.id);
      res.status(200).json(new ApiResponse(200, media, 'Media berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await mediaService.updateMedia(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, media, 'Media berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      await mediaService.deleteMedia(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Media berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new MediaController();