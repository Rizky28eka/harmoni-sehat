import { Types } from 'mongoose';
import { IDrugCart } from '../../models/DrugCart';

export interface CreateDrugCartDto {
  drug_id: string; // Will be ObjectId in service
  jumlah: number;
}

export interface UpdateDrugCartDto {
  jumlah?: number;
}

export interface IDrugCartResponseDto {
  id: string;
  patient_id: string;
  drug_id: string;
  jumlah: number;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugCartResponseDto = (drugCart: IDrugCart): IDrugCartResponseDto => {
  return {
    id: drugCart._id.toString(),
    patient_id: drugCart.patient_id.toString(),
    drug_id: drugCart.drug_id.toString(),
    jumlah: drugCart.jumlah,
    createdAt: drugCart.createdAt,
    updatedAt: drugCart.updatedAt,
  };
};
