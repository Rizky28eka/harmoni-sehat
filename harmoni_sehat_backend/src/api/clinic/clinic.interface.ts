
import { Document, Types } from 'mongoose';

export interface IClinic extends Document {
  nama_klinik: string;
  alamat: string;
  telepon: string;
  email: string;
  deskripsi?: string;
  gambar_url?: string;
  latitude?: number;
  longitude?: number;
}

export interface IClinicResponseDto {
  id: string;
  nama_klinik: string;
  alamat: string;
  telepon: string;
  email: string;
  deskripsi?: string;
  gambar_url?: string;
  latitude?: number;
  longitude?: number;
}

export const toClinicResponseDto = (clinic: IClinic): IClinicResponseDto => ({
  id: (clinic._id as Types.ObjectId).toString(),
  nama_klinik: clinic.nama_klinik,
  alamat: clinic.alamat,
  telepon: clinic.telepon,
  email: clinic.email,
  deskripsi: clinic.deskripsi,
  gambar_url: clinic.gambar_url,
  latitude: clinic.latitude,
  longitude: clinic.longitude,
});
