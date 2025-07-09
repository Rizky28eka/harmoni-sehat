import { Types } from 'mongoose';
import { IClinic } from '../../models/Clinic';

export interface CreateClinicDto {
  nama: string;
  alamat: string;
  no_telepon: string;
  email: string;
  status?: 'active' | 'inactive';
}

export interface UpdateClinicDto {
  nama?: string;
  alamat?: string;
  no_telepon?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface IClinicResponseDto {
  id: string;
  nama: string;
  alamat: string;
  no_telepon: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export const toClinicResponseDto = (clinic: IClinic): IClinicResponseDto => {
  return {
    id: clinic._id.toString(),
    nama: clinic.nama,
    alamat: clinic.alamat,
    no_telepon: clinic.no_telepon,
    email: clinic.email,
    status: clinic.status,
    createdAt: clinic.createdAt,
    updatedAt: clinic.updatedAt,
  };
};
