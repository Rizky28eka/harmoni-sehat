import { Types } from 'mongoose';
import { IPharmacist } from '../../models/Pharmacist';

export interface CreatePharmacistDto {
  nama: string;
  nomor_sipa: string;
}

export interface UpdatePharmacistDto {
  nama?: string;
  nomor_sipa?: string;
}

export interface IPharmacistResponseDto {
  id: string;
  user_id: string;
  nama: string;
  nomor_sipa: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toPharmacistResponseDto = (pharmacist: IPharmacist): IPharmacistResponseDto => {
  return {
    id: pharmacist._id.toString(),
    user_id: pharmacist.user_id.toString(),
    nama: pharmacist.nama,
    nomor_sipa: pharmacist.nomor_sipa,
    createdAt: pharmacist.createdAt,
    updatedAt: pharmacist.updatedAt,
  };
};
