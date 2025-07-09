import { Request, Response, NextFunction } from 'express';
import HealthArticleService from './healthArticle.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toHealthArticleResponseDto } from './healthArticle.interface';
import { CreateHealthArticleInput, UpdateHealthArticleInput } from './healthArticle.validation';

class HealthArticleController {
  async createHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleData: CreateHealthArticleInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newArticle = await HealthArticleService.createHealthArticle(userId.toString(), articleData);
      res.status(201).json(new ApiResponse(201, toHealthArticleResponseDto(newArticle), 'Health article created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllHealthArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = await HealthArticleService.getAllHealthArticles();
      res.status(200).json(new ApiResponse(200, articles.map(toHealthArticleResponseDto), 'Health articles fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getHealthArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await HealthArticleService.getHealthArticleById(req.params.id);
      res.status(200).json(new ApiResponse(200, toHealthArticleResponseDto(article!), 'Health article fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleData: UpdateHealthArticleInput = req.body;
      const articleId = req.params.id; // ID of the health article to update
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const updatedArticle = await HealthArticleService.updateHealthArticle(userId.toString(), articleId, articleData);
      res.status(200).json(new ApiResponse(200, toHealthArticleResponseDto(updatedArticle!), 'Health article updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteHealthArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleId = req.params.id; // ID of the health article to delete
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      await HealthArticleService.deleteHealthArticle(userId.toString(), articleId);
      res.status(204).json(new ApiResponse(204, null, 'Health article deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new HealthArticleController();
