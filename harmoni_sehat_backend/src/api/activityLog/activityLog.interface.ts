import { Types } from 'mongoose';
import { IActivityLog } from '../../models/ActivityLog';

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
  deskripsi?: string;
  timestamp: Date;
}

export const toActivityLogResponseDto = (activityLog: any): IActivityLogResponseDto => {
  return {
    id: activityLog._id.toString(),
    user_id: activityLog.user_id.toString(),
    aksi: activityLog.aksi,
    deskripsi: activityLog.deskripsi,
    timestamp: activityLog.timestamp,
  };
};
