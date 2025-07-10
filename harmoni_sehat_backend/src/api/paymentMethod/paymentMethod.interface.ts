import { Types } from 'mongoose';
import { IPaymentMethod } from '../../models/PaymentMethod';

export interface CreatePaymentMethodDto {
  nama: string;
  kode: string;
  deskripsi?: string;
  is_active?: boolean;
}

export interface UpdatePaymentMethodDto {
  nama?: string;
  kode?: string;
  deskripsi?: string;
  is_active?: boolean;
}

export interface IPaymentMethodResponseDto {
  id: string;
  nama: string;
  kode: string;
  deskripsi?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toPaymentMethodResponseDto = (paymentMethod: any): IPaymentMethodResponseDto => {
  return {
    id: paymentMethod._id.toString(),
    nama: paymentMethod.nama,
    kode: paymentMethod.kode,
    deskripsi: paymentMethod.deskripsi,
    is_active: paymentMethod.is_active,
    createdAt: paymentMethod.createdAt,
    updatedAt: paymentMethod.updatedAt,
  };
};
