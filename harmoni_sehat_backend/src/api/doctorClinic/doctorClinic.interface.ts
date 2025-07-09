import { Types } from 'mongoose';
import { IDoctorClinic } from '../../models/DoctorClinic';

export interface CreateDoctorClinicDto {
  doctor_id: string; // Will be ObjectId in service
  clinic_id: string; // Will be ObjectId in service
  status?: 'active' | 'inactive';
}

export interface UpdateDoctorClinicDto {
  doctor_id?: string;
  clinic_id?: string;
  status?: 'active' | 'inactive';
}

export interface IDoctorClinicResponseDto {
  id: string;
  doctor_id: string;
  clinic_id: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export const toDoctorClinicResponseDto = (doctorClinic: IDoctorClinic): IDoctorClinicResponseDto => {
  return {
    id: doctorClinic._id.toString(),
    doctor_id: doctorClinic.doctor_id.toString(),
    clinic_id: doctorClinic.clinic_id.toString(),
    status: doctorClinic.status,
    createdAt: doctorClinic.createdAt,
    updatedAt: doctorClinic.updatedAt,
  };
};
