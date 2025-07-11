import { Document, Types } from 'mongoose';
import { IActivityLog as IActivityLogModel } from '../../models/ActivityLog';

export interface CreateActivityLogDto {
  user_id: string; // Will be ObjectId in service
  aksi: string;
  deskripsi?: string;
  timestamp?: Date; // Optional, will default to Date.now
}

export interface UpdateActivityLogDto {
  user_id?: string;
  aksi?: string;
  deskripsi?: string;
  timestamp?: Date;
}

export interface IActivityLogResponseDto {
  id: string;
  user_id: string;
  aksi: string;
  timestamp: Date;
  deskripsi?: string;
}

export const toActivityLogResponseDto = (activityLog: IActivityLogModel): IActivityLogResponseDto => ({
  id: (activityLog._id as Types.ObjectId).toString(),
  user_id: (activityLog.user_id as Types.ObjectId).toString(),
  aksi: activityLog.aksi,
  timestamp: activityLog.timestamp,
  deskripsi: activityLog.deskripsi,
});

