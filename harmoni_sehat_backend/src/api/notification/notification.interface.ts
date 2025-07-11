
import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  user_id: Types.ObjectId;
  judul: string;
  pesan: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  dibaca: boolean;
  tanggal_kirim: Date;
  link?: string;
}

export interface INotificationResponseDto {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  dibaca: boolean;
  tanggal_kirim: Date;
  link?: string;
}

export const toNotificationResponseDto = (notification: INotification): INotificationResponseDto => ({
  id: (notification._id as Types.ObjectId).toString(),
  user_id: (notification.user_id as Types.ObjectId).toString(),
  judul: notification.judul,
  pesan: notification.pesan,
  tipe: notification.tipe,
  dibaca: notification.dibaca,
  tanggal_kirim: notification.tanggal_kirim,
  link: notification.link,
});
