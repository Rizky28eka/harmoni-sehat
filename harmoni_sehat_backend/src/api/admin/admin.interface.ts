import { Types } from 'mongoose';
import { IAdmin as IAdminModel } from '../../models/Admin';

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
}

export const toAdminResponseDto = (admin: IAdminModel): IAdminResponseDto => ({
  id: admin._id.toString(),
  user_id: (admin.user_id as Types.ObjectId).toString(),
  nama: admin.nama,
});
