import { Types } from 'mongoose';
import { IPasien } from '../../models/Pasien';

export interface CreatePatientDto {
  nama: string;
  nik: string;
  tanggal_lahir: Date;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon: string;
}

export interface UpdatePatientDto {
  nama?: string;
  nik?: string;
  tanggal_lahir?: Date;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  no_telepon?: string;
}

export interface IPatientResponseDto {
  id: string;
  user_id: string;
  nama: string;
  nik: string;
  tanggal_lahir: Date;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toPatientResponseDto = (patient: any): IPatientResponseDto => {
  return {
    id: patient._id.toString(),
    user_id: patient.user_id.toString(),
    nama: patient.nama,
    nik: patient.nik,
    tanggal_lahir: patient.tanggal_lahir,
    jenis_kelamin: patient.jenis_kelamin,
    alamat: patient.alamat,
    no_telepon: patient.no_telepon,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
};
