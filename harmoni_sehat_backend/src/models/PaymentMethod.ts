import { Schema, model, Document, Types } from 'mongoose';

export interface IPaymentMethod extends Document {
  _id: Types.ObjectId;
  nama: string;
  kode: string;
  deskripsi?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
  nama: {
    type: String,
    required: true,
    trim: true,
  },
  kode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deskripsi: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
});

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
