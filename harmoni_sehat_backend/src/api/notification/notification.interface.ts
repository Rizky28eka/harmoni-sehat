import { Types } from 'mongoose';
import { INotification } from '../../models/Notification';

export interface CreateNotificationDto {
  user_id: string; // Will be ObjectId in service
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  is_read?: boolean;
}

export interface UpdateNotificationDto {
  judul?: string;
  isi?: string;
  tipe?: 'info' | 'warning' | 'error' | 'success';
  is_read?: boolean;
}

export interface INotificationResponseDto {
  id: string;
  user_id: string;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toNotificationResponseDto = (notification: any): INotificationResponseDto => {
  return {
    id: notification._id.toString(),
    user_id: notification.user_id.toString(),
    judul: notification.judul,
    isi: notification.isi,
    tipe: notification.tipe,
    is_read: notification.is_read,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
};
