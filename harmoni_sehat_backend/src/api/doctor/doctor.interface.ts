import { Types } from 'mongoose';
import { IDokter } from '../../models/Dokter';

export interface CreateDoctorDto {
  nama: string;
  nomor_str: string;
  specialization_id: string; // Will be ObjectId in service
  biaya_konsultasi: number;
  foto?: string;
  bio?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UpdateDoctorDto {
  nama?: string;
  nomor_str?: string;
  specialization_id?: string;
  biaya_konsultasi?: number;
  foto?: string;
  bio?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface IDoctorResponseDto {
  id: string;
  user_id: string;
  nama: string;
  nomor_str: string;
  specialization_id: string; // Will be populated in service/controller
  biaya_konsultasi: number;
  foto?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export const toDoctorResponseDto = (doctor: any): IDoctorResponseDto => {
  return {
    id: doctor._id.toString(),
    user_id: doctor.user_id.toString(),
    nama: doctor.nama,
    nomor_str: doctor.nomor_str,
    specialization_id: doctor.specialization_id.toString(),
    biaya_konsultasi: doctor.biaya_konsultasi,
    foto: doctor.foto,
    bio: doctor.bio,
    status: doctor.status,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };
};
