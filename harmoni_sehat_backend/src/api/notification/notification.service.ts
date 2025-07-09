import Notification, { INotification } from '../../models/Notification';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateNotificationInput, UpdateNotificationInput } from './notification.validation';
import User from '../../models/User';

class NotificationService {
  async createNotification(notificationData: CreateNotificationInput): Promise<INotification> {
    // Check if user exists
    const user = await User.findById(notificationData.user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const newNotification = await Notification.create(notificationData);
    return newNotification;
  }

  async getAllNotifications(): Promise<INotification[]> {
    return Notification.find().populate('user_id');
  }

  async getNotificationById(notificationId: string): Promise<INotification | null> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new AppError('Invalid Notification ID', 400);
    }
    const notification = await Notification.findById(notificationId).populate('user_id');
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  async getMyNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ user_id: userId }).populate('user_id');
  }

  async updateNotification(notificationId: string, notificationData: UpdateNotificationInput): Promise<INotification | null> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new AppError('Invalid Notification ID', 400);
    }
    const notification = await Notification.findByIdAndUpdate(notificationId, notificationData, { new: true, runValidators: true });
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new AppError('Invalid Notification ID', 400);
    }
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
  }
}

export default new NotificationService();
