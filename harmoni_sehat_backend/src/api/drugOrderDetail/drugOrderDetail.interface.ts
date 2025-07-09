import { Types } from 'mongoose';
import { IDrugOrderDetail } from '../../models/DrugOrderDetail';

export interface CreateDrugOrderDetailDto {
  order_id: string; // Will be ObjectId in service
  drug_id: string; // Will be ObjectId in service
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

export interface UpdateDrugOrderDetailDto {
  order_id?: string;
  drug_id?: string;
  harga_satuan?: number;
  jumlah?: number;
  subtotal?: number;
}

export interface IDrugOrderDetailResponseDto {
  id: string;
  order_id: string;
  drug_id: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugOrderDetailResponseDto = (drugOrderDetail: IDrugOrderDetail): IDrugOrderDetailResponseDto => {
  return {
    id: drugOrderDetail._id.toString(),
    order_id: drugOrderDetail.order_id.toString(),
    drug_id: drugOrderDetail.drug_id.toString(),
    harga_satuan: drugOrderDetail.harga_satuan,
    jumlah: drugOrderDetail.jumlah,
    subtotal: drugOrderDetail.subtotal,
    createdAt: drugOrderDetail.createdAt,
    updatedAt: drugOrderDetail.updatedAt,
  };
};
