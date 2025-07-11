
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

import { Document, Types } from 'mongoose';

export interface IPatient extends Document {
  user_id: Types.ObjectId;
  nama: string;
  tanggal_lahir?: Date;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  telepon?: string;
  riwayat_medis?: string;
  alergi?: string;
  golongan_darah?: 'A' | 'B' | 'AB' | 'O';
}

export interface IPatientResponseDto {
  id: string;
  user_id: string;
  nama: string;
  tanggal_lahir?: Date;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  telepon?: string;
  riwayat_medis?: string;
  alergi?: string;
  golongan_darah?: 'A' | 'B' | 'AB' | 'O';
}

export const toPatientResponseDto = (patient: IPatient): IPatientResponseDto => ({
  id: (patient._id as Types.ObjectId).toString(),
  user_id: (patient.user_id as Types.ObjectId).toString(),
  nama: patient.nama,
  tanggal_lahir: patient.tanggal_lahir,
  jenis_kelamin: patient.jenis_kelamin,
  alamat: patient.alamat,
  telepon: patient.telepon,
  riwayat_medis: patient.riwayat_medis,
  alergi: patient.alergi,
  golongan_darah: patient.golongan_darah,
});
