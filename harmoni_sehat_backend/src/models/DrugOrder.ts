import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugOrder extends Document {
  _id: Types.ObjectId;
  patient_id: Types.ObjectId;
  kode_pesanan: string;
  total_harga: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
  createdAt: Date;
  updatedAt: Date;
}

const drugOrderSchema = new Schema<IDrugOrder>({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
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
  },
},
{
  timestamps: true,
});

const DrugOrder = model<IDrugOrder>('DrugOrder', drugOrderSchema);

export default DrugOrder;
