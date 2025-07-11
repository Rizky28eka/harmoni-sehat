
import { Document, Types } from 'mongoose';
import { IDrugOrderDetail as IDrugOrderDetailModel } from '../../models/DrugOrderDetail';

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
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export const toDrugOrderDetailResponseDto = (drugOrderDetail: IDrugOrderDetailModel): IDrugOrderDetailResponseDto => ({
  id: (drugOrderDetail._id as Types.ObjectId).toString(),
  pesanan_id: (drugOrderDetail.pesanan_id as Types.ObjectId).toString(),
  obat_id: (drugOrderDetail.obat_id as Types.ObjectId).toString(),
  jumlah: drugOrderDetail.jumlah,
  harga_satuan: drugOrderDetail.harga_satuan,
  subtotal: drugOrderDetail.subtotal,
});
