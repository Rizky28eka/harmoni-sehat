import { IMedicalRecord } from '../../models/MedicalRecord';
import { Types } from 'mongoose';

export interface CreateMedicalRecordDto {
  patient_id: string;
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
}

export interface UpdateMedicalRecordDto {
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
}

export interface MedicalRecordResponseDto {
  id: string;
  patient_id: string;
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const toMedicalRecordResponseDto = (record: IMedicalRecord): MedicalRecordResponseDto => {
  return {
    id: (record._id as Types.ObjectId).toString(),
    patient_id: record.patient_id.toString(),
    riwayat_penyakit: record.riwayat_penyakit,
    alergi: record.alergi,
    riwayat_vaksinasi: record.riwayat_vaksinasi,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};
