import { Types } from 'mongoose';
import { IDoctorClinic } from '../../models/DoctorClinic';

export interface CreateDoctorClinicDto {
  dokter_id: string; // Will be ObjectId in service
  klinik_id: string; // Will be ObjectId in service
  status?: 'active' | 'inactive';
}

export interface UpdateDoctorClinicDto {
  dokter_id?: string;
  klinik_id?: string;
  status?: 'active' | 'inactive';
}

export interface IDoctorClinicResponseDto {
  id: string;
  dokter_id: string;
  klinik_id: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export const toDoctorClinicResponseDto = (doctorClinic: any): IDoctorClinicResponseDto => {
  return {
    id: doctorClinic._id.toString(),
    dokter_id: doctorClinic.dokter_id.toString(),
    klinik_id: doctorClinic.klinik_id.toString(),
    status: doctorClinic.status,
    createdAt: doctorClinic.createdAt,
    updatedAt: doctorClinic.updatedAt,
  };
};
