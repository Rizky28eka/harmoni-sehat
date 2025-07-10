import { Types } from 'mongoose';
import { IDrugCart } from '../../models/DrugCart';

export interface CreateDrugCartDto {
  obat_id: string; // Will be ObjectId in service
  jumlah: number;
}

export interface UpdateDrugCartDto {
  jumlah?: number;
}

export interface IDrugCartResponseDto {
  id: string;
  pasien_id: string;
  obat_id: string;
  jumlah: number;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugCartResponseDto = (drugCart: any): IDrugCartResponseDto => {
  return {
    id: drugCart._id.toString(),
    pasien_id: drugCart.pasien_id.toString(),
    obat_id: drugCart.obat_id.toString(),
    jumlah: drugCart.jumlah,
    createdAt: drugCart.createdAt,
    updatedAt: drugCart.updatedAt,
  };
};
