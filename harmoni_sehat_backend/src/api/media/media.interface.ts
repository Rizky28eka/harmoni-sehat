
import { Document, Types } from 'mongoose';
import { IMedia as IMediaModel } from '../../models/Media';

export interface CreateMediaDto {
  model_type: string; // e.g., 'User', 'HealthArticle'
  model_id: string; // Will be ObjectId in service
  url: string;
  mime_type?: string;
  size?: number; // in bytes
}

export interface UpdateMediaDto {
  model_type?: string;
  model_id?: string;
  url?: string;
  mime_type?: string;
  size?: number;
}

export interface IMediaResponseDto {
  id: string;
  model_type: string;
  model_id: string;
  url: string;
  mime_type: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export const toMediaResponseDto = (media: IMediaModel): IMediaResponseDto => ({
  id: (media._id as Types.ObjectId).toString(),
  model_type: media.model_type,
  model_id: (media.model_id as Types.ObjectId).toString(),
  url: media.url,
  mime_type: media.mime_type,
  size: media.size,
  createdAt: media.createdAt,
  updatedAt: media.updatedAt,
});
