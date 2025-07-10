import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugOrder extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  kode_pesanan: string;
  total_harga: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
  createdAt: Date;
  updatedAt: Date;
}

const DrugOrderSchema = new Schema<IDrugOrder>({
  pasien_id: {
    type: String,
    ref: 'Pasien',
    required: true,
  },
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
}, { timestamps: true });

const DrugOrder = model<IDrugOrder>('DrugOrder', DrugOrderSchema);

export default DrugOrder;