import { Schema, model, Document, Types } from 'mongoose';

export interface IDrug extends Document {
  _id: Types.ObjectId;
  nama: string;
  deskripsi?: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string; // e.g., 'tablet', 'botol', 'strip'
  butuh_resep: boolean;
  tgl_kadaluarsa: Date;
}

const drugSchema = new Schema<IDrug>({
  nama: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deskripsi: {
    type: String,
  },
  kategori: {
    type: String,
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  stok: {
    type: Number,
    required: true,
    default: 0,
  },
  satuan: {
    type: String,
    required: true,
    trim: true,
  },
  butuh_resep: {
    type: Boolean,
    default: false,
  },
  tgl_kadaluarsa: {
    type: Date,
    required: true,
  },
},
{
  timestamps: true,
});

const Drug = model<IDrug>('Drug', drugSchema);

export default Drug;
