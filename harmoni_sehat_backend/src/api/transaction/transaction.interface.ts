
import { Types } from 'mongoose';
import { ITransaction } from '../../models/Transaction';

export interface CreateTransactionDto {
  user_id: Types.ObjectId; // Will be ObjectId in service
  total_biaya: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  metode_pembayaran_id: Types.ObjectId; // Will be ObjectId in service
  external_id?: string;
  transaksiable_id: Types.ObjectId; // Will be ObjectId in service
  transaksiable_type: string; // e.g., 'Consultation', 'DrugOrder'
}

export interface UpdateTransactionDto {
  total_biaya?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  metode_pembayaran_id?: string;
  external_id?: string;
  transaksiable_id?: string;
  transaksiable_type?: string;
}



export interface ITransactionResponseDto {
  id: string;
  user_id: string;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metode_pembayaran_id: string;
  external_id?: string;
  transaksiable_id: string;
  transaksiable_type: string;
}

export const toTransactionResponseDto = (transaction: ITransaction): ITransactionResponseDto => ({
  id: (transaction._id as Types.ObjectId).toString(),
  user_id: (transaction.user_id as Types.ObjectId).toString(),
  total_biaya: transaction.total_biaya,
  status: transaction.status,
  metode_pembayaran_id: (transaction.metode_pembayaran_id as Types.ObjectId).toString(),
  external_id: transaction.external_id,
  transaksiable_id: (transaction.transaksiable_id as Types.ObjectId).toString(),
  transaksiable_type: transaction.transaksiable_type,
});
