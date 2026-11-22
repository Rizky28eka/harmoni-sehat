import { ownerScope } from '../plugins/ownerScope';
import { userOwnedScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  user_id: Types.ObjectId;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'expired';
  metode_pembayaran_id: Types.ObjectId;
  order_id: string;
  payment_url?: string;
  payment_token?: string;
  paid_at?: Date;
  external_id?: string; // Transaction ID from payment gateway
  transaksiable_id: Types.ObjectId; // ID of the related entity (e.g., Consultation, DrugOrder)
  transaksiable_type: string; // Type of the related entity (e.g., 'Consultation', 'DrugOrder')
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    total_biaya: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'expired'],
      default: 'pending',
    },
    metode_pembayaran_id: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      required: false,
    },
    order_id: { type: String, unique: true, index: true, default: () => `TRX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` },
    payment_url: { type: String },
    payment_token: { type: String },
    paid_at: { type: Date },
    external_id: {
      type: String,
      trim: true,
    },
    transaksiable_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    transaksiable_type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

ownerScope(TransactionSchema, userOwnedScope('user_id'));

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
