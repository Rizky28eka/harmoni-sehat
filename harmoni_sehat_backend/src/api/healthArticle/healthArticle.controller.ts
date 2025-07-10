import { Request, Response, NextFunction } from 'express';
import healthArticleService from './healthArticle.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class HealthArticleController {
  async createHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const healthArticle = await healthArticleService.createHealthArticle(req.body);
      res.status(201).json(new ApiResponse(201, healthArticle, 'Artikel kesehatan berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllHealthArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const healthArticles = await healthArticleService.getAllHealthArticles();
      res.status(200).json(new ApiResponse(200, healthArticles, 'Daftar artikel kesehatan berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getHealthArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const healthArticle = await healthArticleService.getHealthArticleById(req.params.id);
      res.status(200).json(new ApiResponse(200, healthArticle, 'Artikel kesehatan berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const healthArticle = await healthArticleService.updateHealthArticle(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, healthArticle, 'Artikel kesehatan berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      await healthArticleService.deleteHealthArticle(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Artikel kesehatan berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new HealthArticleController();