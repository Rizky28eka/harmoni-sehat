import { Types } from 'mongoose';
import { IPrescriptionDrug } from '../../models/PrescriptionDrug';

export interface CreatePrescriptionDrugDto {
  prescription_id: string; // Will be ObjectId in service
  drug_id: string; // Will be ObjectId in service
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
  prescription_id: string;
  drug_id: string;
  dosis: string;
  jumlah: number;
  aturan_pakai: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toPrescriptionDrugResponseDto = (prescriptionDrug: IPrescriptionDrug): IPrescriptionDrugResponseDto => {
  return {
    id: prescriptionDrug._id.toString(),
    prescription_id: prescriptionDrug.prescription_id.toString(),
    drug_id: prescriptionDrug.drug_id.toString(),
    dosis: prescriptionDrug.dosis,
    jumlah: prescriptionDrug.jumlah,
    aturan_pakai: prescriptionDrug.aturan_pakai,
    createdAt: prescriptionDrug.createdAt,
    updatedAt: prescriptionDrug.updatedAt,
  };
};
