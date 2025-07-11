
import { Types } from 'mongoose';
import { IPrescriptionDrug } from '../../models/PrescriptionDrug';

export interface CreatePrescriptionDrugDto {
  resep_id: Types.ObjectId; // Will be ObjectId in service
  obat_id: Types.ObjectId; // Will be ObjectId in service
  dosis: string;
  jumlah: number;
  aturan_pakai: string;
}

export interface UpdatePrescriptionDrugDto {
  dosis?: string;
  jumlah?: number;
  aturan_pakai?: string;
}



export interface IPrescriptionDrugResponseDto {
  id: string;
  resep_id: string;
  obat_id: string;
  dosis: string;
  jumlah: number;
  aturan_pakai: string;
}

export const toPrescriptionDrugResponseDto = (prescriptionDrug: IPrescriptionDrug): IPrescriptionDrugResponseDto => ({
  id: (prescriptionDrug._id as Types.ObjectId).toString(),
  resep_id: (prescriptionDrug.resep_id as Types.ObjectId).toString(),
  obat_id: (prescriptionDrug.obat_id as Types.ObjectId).toString(),
  dosis: prescriptionDrug.dosis,
  jumlah: prescriptionDrug.jumlah,
  aturan_pakai: prescriptionDrug.aturan_pakai,
});
