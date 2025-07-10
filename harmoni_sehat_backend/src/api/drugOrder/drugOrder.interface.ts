import { Types } from 'mongoose';
import { IDrugOrder } from '../../models/DrugOrder';

export interface CreateDrugOrderDto {
  // patient_id will come from req.user
  kode_pesanan: string;
  total_harga: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
}

export interface UpdateDrugOrderDto {
  kode_pesanan?: string;
  total_harga?: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman?: string;
}

export interface IDrugOrderResponseDto {
  id: string;
  pasien_id: string;
  kode_pesanan: string;
  total_harga: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toDrugOrderResponseDto = (drugOrder: any): IDrugOrderResponseDto => {
  return {
    id: drugOrder._id.toString(),
    pasien_id: drugOrder.pasien_id.toString(),
    kode_pesanan: drugOrder.kode_pesanan,
    total_harga: drugOrder.total_harga,
    status: drugOrder.status,
    alamat_pengiriman: drugOrder.alamat_pengiriman,
    createdAt: drugOrder.createdAt,
    updatedAt: drugOrder.updatedAt,
  };
};
