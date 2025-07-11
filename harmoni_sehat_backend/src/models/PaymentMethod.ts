import { Schema, model, Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  nama: string;
  kode: string;
  deskripsi?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    nama: {
      type: String,
      required: true,
      unique: true,
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
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);

export default PaymentMethod;
