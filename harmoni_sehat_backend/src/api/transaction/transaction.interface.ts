import { Types } from 'mongoose';
import { ITransaction } from '../../models/Transaction';

export interface CreateTransactionDto {
  user_id: string; // Will be ObjectId in service
  total_biaya: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method_id: string; // Will be ObjectId in service
  external_id?: string;
  transaksiable_id: string; // Will be ObjectId in service
  transaksiable_type: string; // e.g., 'Consultation', 'DrugOrder'
}

export interface UpdateTransactionDto {
  total_biaya?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method_id?: string;
  external_id?: string;
  transaksiable_id?: string;
  transaksiable_type?: string;
}

export interface ITransactionResponseDto {
  id: string;
  user_id: string;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method_id: string;
  external_id?: string;
  transaksiable_id: string;
  transaksiable_type: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toTransactionResponseDto = (transaction: ITransaction): ITransactionResponseDto => {
  return {
    id: transaction._id.toString(),
    user_id: transaction.user_id.toString(),
    total_biaya: transaction.total_biaya,
    status: transaction.status,
    payment_method_id: transaction.payment_method_id.toString(),
    external_id: transaction.external_id,
    transaksiable_id: transaction.transaksiable_id.toString(),
    transaksiable_type: transaction.transaksiable_type,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
};
