import Notification, { INotification } from '../../models/Notification';
import { AppError } from '../../utils/AppError';

class NotificationService {
  async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = await Notification.create(data);
    return notification;
  }

  async getAllNotifications(): Promise<INotification[]> {
    const notifications = await Notification.find().populate('user_id');
    return notifications;
  }

  async getNotificationById(id: string): Promise<INotification> {
    const notification = await Notification.findById(id).populate('user_id');
    if (!notification) {
      throw new AppError('Notifikasi tidak ditemukan', 404);
    }
    return notification;
  }

  async updateNotification(id: string, data: Partial<INotification>): Promise<INotification> {
    const notification = await Notification.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!notification) {
      throw new AppError('Notifikasi tidak ditemukan', 404);
    }
    return notification;
  }

  async deleteNotification(id: string): Promise<void> {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      throw new AppError('Notifikasi tidak ditemukan', 404);
    }
  }
}

export default new NotificationService();