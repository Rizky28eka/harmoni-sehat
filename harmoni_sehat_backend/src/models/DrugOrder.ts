import { ownerScope } from '../plugins/ownerScope';
import { drugOrderScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugOrder extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  kode_pesanan: string;
  resep_id?: Types.ObjectId;
  transaksi_id?: Types.ObjectId;
  catatan_pengiriman?: string;
  no_resi?: string;
  payment_status: 'unpaid' | 'paid';
  total_harga: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
  createdAt: Date;
  updatedAt: Date;
}

const DrugOrderSchema = new Schema<IDrugOrder>(
  {
    pasien_id: {
      type: String,
      ref: 'Pasien',
      required: true,
      index: true, // Add index for efficient lookups
    },
    resep_id: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    transaksi_id: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    catatan_pengiriman: { type: String, trim: true },
    no_resi: { type: String, trim: true },
    payment_status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    kode_pesanan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    total_harga: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    alamat_pengiriman: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

ownerScope(DrugOrderSchema, drugOrderScope);

const DrugOrder = model<IDrugOrder>('DrugOrder', DrugOrderSchema);

export default DrugOrder;
