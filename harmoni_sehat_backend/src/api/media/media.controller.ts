import { Request, Response, NextFunction } from 'express';
import MediaService from './media.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toMediaResponseDto } from './media.interface';
import { CreateMediaInput, UpdateMediaInput } from './media.validation';
import User from '../../models/User';
import HealthArticle from '../../models/HealthArticle';

class MediaController {
  async createMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const mediaData: CreateMediaInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ownership check: Ensure the logged-in user is the owner of the model_id
      // This is a simplified check. A more robust solution would involve checking
      // the actual model (User, HealthArticle, etc.) for ownership.
      if (mediaData.model_type === 'User') {
        if (mediaData.model_id !== userId.toString()) {
          return next(new AppError('You can only upload media for your own user profile.', 403));
        }
      } else if (mediaData.model_type === 'HealthArticle') {
        const article = await HealthArticle.findById(mediaData.model_id);
        if (!article) {
          return next(new AppError('Health Article not found.', 404));
        }
        // Check if the logged-in user is the author of the article or an admin
        if (article.author_id.toString() !== userId.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to upload media for this article.', 403));
        }
      } else {
        // For other model types, a more generic authorization might be needed
        if (!req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to upload media for this model type.', 403));
        }
      }

      const newMedia = await MediaService.createMedia(mediaData);
      res.status(201).json(new ApiResponse(201, toMediaResponseDto(newMedia), 'Media created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await MediaService.getAllMedia();
      res.status(200).json(new ApiResponse(200, media.map(toMediaResponseDto), 'Media fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMediaById(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await MediaService.getMediaById(req.params.id);

      // Ownership authorization: Check if the logged-in user is the owner of the model_id or an admin
      if (media?.model_type === 'User') {
        if (media.model_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access this media.', 403));
        }
      } else if (media?.model_type === 'HealthArticle') {
        const article = await HealthArticle.findById(media.model_id);
        if (!article) {
          return next(new AppError('Health Article not found.', 404));
        }
        if (article.author_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access this media.', 403));
        }
      } else {
        if (!req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access media of this model type.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toMediaResponseDto(media!), 'Media fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMediaByModel(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelType, modelId } = req.params;

      // Ownership authorization: Check if the logged-in user is the owner of the model_id or an admin
      if (modelType === 'User') {
        if (modelId !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access media for this user.', 403));
        }
      } else if (modelType === 'HealthArticle') {
        const article = await HealthArticle.findById(modelId);
        if (!article) {
          return next(new AppError('Health Article not found.', 404));
        }
        if (article.author_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access media for this article.', 403));
        }
      } else {
        if (!req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to access media of this model type.', 403));
        }
      }

      const media = await MediaService.getMediaByModel(modelType, modelId);
      res.status(200).json(new ApiResponse(200, media.map(toMediaResponseDto), 'Media by model fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const mediaData: UpdateMediaInput = req.body;
      const mediaId = req.params.id; // ID of the media to update

      // Get the media first to check ownership
      const existingMedia = await MediaService.getMediaById(mediaId);
      if (!existingMedia) {
        return next(new AppError('Media not found', 404));
      }

      // Ownership authorization: Check if the logged-in user is the owner of the model_id or an admin
      if (existingMedia.model_type === 'User') {
        if (existingMedia.model_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to update this media.', 403));
        }
      } else if (existingMedia.model_type === 'HealthArticle') {
        const article = await HealthArticle.findById(existingMedia.model_id);
        if (!article) {
          return next(new AppError('Health Article not found.', 404));
        }
        if (article.author_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to update this media.', 403));
        }
      } else {
        if (!req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to update media of this model type.', 403));
        }
      }

      const updatedMedia = await MediaService.updateMedia(mediaId, mediaData);
      res.status(200).json(new ApiResponse(200, toMediaResponseDto(updatedMedia!), 'Media updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const mediaId = req.params.id; // ID of the media to delete

      // Get the media first to check ownership
      const existingMedia = await MediaService.getMediaById(mediaId);
      if (!existingMedia) {
        return next(new AppError('Media not found', 404));
      }

      // Ownership authorization: Check if the logged-in user is the owner of the model_id or an admin
      if (existingMedia.model_type === 'User') {
        if (existingMedia.model_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to delete this media.', 403));
        }
      } else if (existingMedia.model_type === 'HealthArticle') {
        const article = await HealthArticle.findById(existingMedia.model_id);
        if (!article) {
          return next(new AppError('Health Article not found.', 404));
        }
        if (article.author_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to delete this media.', 403));
        }
      } else {
        if (!req.user?.roles?.includes('admin')) {
          return next(new AppError('You are not authorized to delete media of this model type.', 403));
        }
      }

      await MediaService.deleteMedia(mediaId);
      res.status(204).json(new ApiResponse(204, null, 'Media deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new MediaController();
