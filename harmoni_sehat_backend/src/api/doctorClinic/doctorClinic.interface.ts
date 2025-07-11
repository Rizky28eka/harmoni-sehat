
import { Document, Types } from 'mongoose';
import { IDoctorClinic as IDoctorClinicModel } from '../../models/DoctorClinic';

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
}

export const toDoctorClinicResponseDto = (doctorClinic: IDoctorClinicModel): IDoctorClinicResponseDto => ({
  id: (doctorClinic._id as Types.ObjectId).toString(),
  dokter_id: doctorClinic.dokter_id.toString(),
  klinik_id: (doctorClinic.klinik_id as Types.ObjectId).toString(),
  status: doctorClinic.status,
});
