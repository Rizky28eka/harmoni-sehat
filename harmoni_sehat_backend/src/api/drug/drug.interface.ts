
import { Document, Types } from 'mongoose';
import { IDrug as IDrugModel } from '../../models/Drug';

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
  stok: number;
  satuan: string;
  harga: number;
  kode_obat: string;
  butuh_resep: boolean;
  tgl_kadaluarsa: Date;
}

export const toDrugResponseDto = (drug: IDrugModel): IDrugResponseDto => ({
  id: (drug._id as Types.ObjectId).toString(),
  nama: drug.nama,
  deskripsi: drug.deskripsi,
  kategori: drug.kategori,
  stok: drug.stok,
  satuan: drug.satuan,
  harga: drug.harga,
  kode_obat: drug.kode_obat,
  butuh_resep: drug.butuh_resep,
  tgl_kadaluarsa: drug.tgl_kadaluarsa,
});
