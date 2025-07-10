import { Request, Response, NextFunction } from 'express';
import notificationService from './notification.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.createNotification(req.body);
      res.status(201).json(new ApiResponse(201, notification, 'Notifikasi berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getAllNotifications();
      res.status(200).json(new ApiResponse(200, notifications, 'Daftar notifikasi berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      res.status(200).json(new ApiResponse(200, notification, 'Notifikasi berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.updateNotification(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, notification, 'Notifikasi berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.deleteNotification(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Notifikasi berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new NotificationController();