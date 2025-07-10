import { Types } from 'mongoose';
import { IDrug } from '../../models/Drug';

export interface CreateDrugDto {
  nama: string;
  deskripsi?: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  butuh_resep?: boolean;
  tgl_kadaluarsa: Date;
}

export interface UpdateDrugDto {
  nama?: string;
  deskripsi?: string;
  kategori?: string;
  harga?: number;
  stok?: number;
  satuan?: string;
  butuh_resep?: boolean;
  tgl_kadaluarsa?: Date;
}

export interface IDrugResponseDto {
  id: string;
  nama: string;
  deskripsi?: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  butuh_resep: boolean;
  tgl_kadaluarsa: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugResponseDto = (drug: any): IDrugResponseDto => {
  return {
    id: drug._id.toString(),
    nama: drug.nama,
    deskripsi: drug.deskripsi,
    kategori: drug.kategori,
    harga: drug.harga,
    stok: drug.stok,
    satuan: drug.satuan,
    butuh_resep: drug.butuh_resep,
    tgl_kadaluarsa: drug.tgl_kadaluarsa,
    createdAt: drug.createdAt,
    updatedAt: drug.updatedAt,
  };
};
