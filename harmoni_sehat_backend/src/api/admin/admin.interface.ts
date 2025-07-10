import { Types } from 'mongoose';
import { IAdmin } from '../../models/Admin';

export interface CreateAdminDto {
  user_id: string; // Will be ObjectId in service
  nama: string;
}

export interface UpdateAdminDto {
  nama?: string;
}

export interface IAdminResponseDto {
  id: string;
  user_id: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toAdminResponseDto = (admin: any): IAdminResponseDto => {
  return {
    id: admin._id.toString(),
    user_id: admin.user_id.toString(),
    nama: admin.nama,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};
