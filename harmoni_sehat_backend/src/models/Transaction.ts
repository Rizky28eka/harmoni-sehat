import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  user_id: Types.ObjectId;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metode_pembayaran_id: Types.ObjectId;
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
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    metode_pembayaran_id: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      required: true,
    },
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

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
