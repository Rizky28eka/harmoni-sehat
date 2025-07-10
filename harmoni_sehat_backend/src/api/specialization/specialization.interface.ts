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
  createdAt: Date;
  updatedAt: Date;
}

export const toSpecializationResponseDto = (specialization: any): ISpecializationResponseDto => {
  return {
    id: specialization._id.toString(),
    nama: specialization.nama,
    deskripsi: specialization.deskripsi,
    is_active: specialization.is_active,
    createdAt: specialization.createdAt,
    updatedAt: specialization.updatedAt,
  };
};
