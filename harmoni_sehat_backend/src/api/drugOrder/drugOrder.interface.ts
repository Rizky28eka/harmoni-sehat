
import { Document, Types } from 'mongoose';
import { IDrugOrder as IDrugOrderModel } from '../../models/DrugOrder';

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
}

export const toDrugOrderResponseDto = (drugOrder: IDrugOrderModel): IDrugOrderResponseDto => ({
  id: (drugOrder._id as Types.ObjectId).toString(),
  pasien_id: drugOrder.pasien_id.toString(),
  kode_pesanan: drugOrder.kode_pesanan,
  total_harga: drugOrder.total_harga,
  status: drugOrder.status,
  alamat_pengiriman: drugOrder.alamat_pengiriman,
});
