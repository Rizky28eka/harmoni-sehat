import { Request, Response, NextFunction } from 'express';
import NotificationService from './notification.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toNotificationResponseDto } from './notification.interface';
import { CreateNotificationInput, UpdateNotificationInput } from './notification.validation';

class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationData: CreateNotificationInput = req.body;
      const newNotification = await NotificationService.createNotification(notificationData);
      res.status(201).json(new ApiResponse(201, toNotificationResponseDto(newNotification), 'Notification created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getAllNotifications();
      res.status(200).json(new ApiResponse(200, notifications.map(toNotificationResponseDto), 'Notifications fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.getNotificationById(req.params.id);

      // Ownership authorization: User can only access their own notifications
      if (req.user?._id.toString() !== notification?.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access this notification.', 403));
      }

      res.status(200).json(new ApiResponse(200, toNotificationResponseDto(notification!), 'Notification fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const notifications = await NotificationService.getMyNotifications(userId.toString());
      res.status(200).json(new ApiResponse(200, notifications.map(toNotificationResponseDto), 'My notifications fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationData: UpdateNotificationInput = req.body;
      const notificationId = req.params.id; // ID of the notification to update

      // Get the notification first to check ownership
      const existingNotification = await NotificationService.getNotificationById(notificationId);
      if (!existingNotification) {
        return next(new AppError('Notification not found', 404));
      }

      // Ownership authorization: User can only update their own notifications
      if (req.user?._id.toString() !== existingNotification.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to update this notification.', 403));
      }

      const updatedNotification = await NotificationService.updateNotification(notificationId, notificationData);
      res.status(200).json(new ApiResponse(200, toNotificationResponseDto(updatedNotification!), 'Notification updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.id; // ID of the notification to delete

      // Get the notification first to check ownership
      const existingNotification = await NotificationService.getNotificationById(notificationId);
      if (!existingNotification) {
        return next(new AppError('Notification not found', 404));
      }

      // Ownership authorization: User can only delete their own notifications
      if (req.user?._id.toString() !== existingNotification.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to delete this notification.', 403));
      }

      await NotificationService.deleteNotification(notificationId);
      res.status(204).json(new ApiResponse(204, null, 'Notification deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
