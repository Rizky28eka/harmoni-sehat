
import { Document, Types } from 'mongoose';
import { IDrugCart as IDrugCartModel } from '../../models/DrugCart';

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
  tanggal_ditambahkan: Date;
}

export const toDrugCartResponseDto = (drugCart: IDrugCartModel): IDrugCartResponseDto => ({
  id: (drugCart._id as Types.ObjectId).toString(),
  pasien_id: drugCart.pasien_id.toString(),
  obat_id: (drugCart.obat_id as Types.ObjectId).toString(),
  jumlah: drugCart.jumlah,
  tanggal_ditambahkan: drugCart.createdAt,
});
