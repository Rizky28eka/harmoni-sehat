import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method_id: Types.ObjectId;
  external_id?: string; // ID from payment gateway
  transaksiable_id: Types.ObjectId; // Polymorphic reference
  transaksiable_type: string; // e.g., 'Consultation', 'DrugOrder'
}

const transactionSchema = new Schema<ITransaction>({
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
  payment_method_id: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  },
  external_id: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to not violate unique constraint
  },
  transaksiable_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  transaksiable_type: {
    type: String,
    required: true,
    enum: ['Consultation', 'DrugOrder'], // Add other types as needed
  },
},
{
  timestamps: true,
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
