
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
}

export const toPharmacistResponseDto = (pharmacist: IPharmacist): IPharmacistResponseDto => ({
  id: (pharmacist._id as Types.ObjectId).toString(),
  user_id: (pharmacist.user_id as Types.ObjectId).toString(),
  nama: pharmacist.nama,
  nomor_sipa: pharmacist.nomor_sipa,
});
