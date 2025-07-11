
import { Document, Types } from 'mongoose';
import { IDokter as IDokterModel } from '../../models/Dokter';

export interface CreateDoctorDto {
  nama: string;
  nomor_str: string;
  specialization_id: Types.ObjectId; // Will be ObjectId in service
  biaya_konsultasi: number;
  foto?: string;
  bio?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UpdateDoctorDto {
  nama?: string;
  nomor_str?: string;
  specialization_id?: Types.ObjectId;
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
  spesialisasi_id?: string;
  biaya_konsultasi: number;
  foto?: string;
  bio?: string;
  status: 'active' | 'inactive';
}

export const toDoctorResponseDto = (doctor: IDokterModel): IDoctorResponseDto => ({
  id: doctor._id,
  user_id: (doctor.user_id as Types.ObjectId).toString(),
  nama: doctor.nama,
  nomor_str: doctor.nomor_str,
  spesialisasi_id: doctor.spesialisasi_id ? (doctor.spesialisasi_id as Types.ObjectId).toString() as string | undefined : undefined,
  biaya_konsultasi: doctor.biaya_konsultasi,
  foto: doctor.foto,
  bio: doctor.bio,
  status: doctor.status,
});
