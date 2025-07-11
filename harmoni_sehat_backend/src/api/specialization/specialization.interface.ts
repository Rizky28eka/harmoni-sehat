
import { Types } from 'mongoose';
import { ISpecialization } from '../../models/Specialization';

export interface CreateSpecializationDto {
  nama: string;
  deskripsi?: string;
  is_active?: boolean;
}

export interface UpdateSpecializationDto {
  nama?: string;
  deskripsi?: string;
  is_active?: boolean;
}



export interface ISpecializationResponseDto {
  id: string;
  nama: string;
  deskripsi?: string;
  is_active: boolean;
}

export const toSpecializationResponseDto = (specialization: ISpecialization): ISpecializationResponseDto => ({
  id: (specialization._id as Types.ObjectId).toString(),
  nama: specialization.nama,
  deskripsi: specialization.deskripsi,
  is_active: specialization.is_active,
});
