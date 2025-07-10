import { Types } from 'mongoose';
import { IPrescriptionDrug } from '../../models/PrescriptionDrug';

export interface CreatePrescriptionDrugDto {
  resep_id: string; // Will be ObjectId in service
  obat_id: string; // Will be ObjectId in service
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
  createdAt: Date;
  updatedAt: Date;
}

export const toPrescriptionDrugResponseDto = (prescriptionDrug: any): IPrescriptionDrugResponseDto => {
  return {
    id: prescriptionDrug._id.toString(),
    resep_id: prescriptionDrug.resep_id.toString(),
    obat_id: prescriptionDrug.obat_id.toString(),
    dosis: prescriptionDrug.dosis,
    jumlah: prescriptionDrug.jumlah,
    aturan_pakai: prescriptionDrug.aturan_pakai,
    createdAt: prescriptionDrug.createdAt,
    updatedAt: prescriptionDrug.updatedAt,
  };
};
