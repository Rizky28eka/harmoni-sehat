import { Types } from 'mongoose';
import { IDrugOrderDetail } from '../../models/DrugOrderDetail';

export interface CreateDrugOrderDetailDto {
  pesanan_id: string; // Will be ObjectId in service
  obat_id: string; // Will be ObjectId in service
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

export interface UpdateDrugOrderDetailDto {
  pesanan_id?: string;
  obat_id?: string;
  harga_satuan?: number;
  jumlah?: number;
  subtotal?: number;
}

export interface IDrugOrderDetailResponseDto {
  id: string;
  pesanan_id: string;
  obat_id: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugOrderDetailResponseDto = (drugOrderDetail: any): IDrugOrderDetailResponseDto => {
  return {
    id: drugOrderDetail._id.toString(),
    pesanan_id: drugOrderDetail.pesanan_id.toString(),
    obat_id: drugOrderDetail.obat_id.toString(),
    harga_satuan: drugOrderDetail.harga_satuan,
    jumlah: drugOrderDetail.jumlah,
    subtotal: drugOrderDetail.subtotal,
    createdAt: drugOrderDetail.createdAt,
    updatedAt: drugOrderDetail.updatedAt,
  };
};
