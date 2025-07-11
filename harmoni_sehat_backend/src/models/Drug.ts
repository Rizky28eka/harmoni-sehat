import { Schema, model, Document } from 'mongoose';

export interface IDrug extends Document {
  nama: string;
  deskripsi?: string;
  kategori: string;
  stok: number;
  satuan: string;
  harga: number;
  kode_obat: string;
  butuh_resep: boolean;
  tgl_kadaluarsa: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DrugSchema = new Schema<IDrug>(
  {
    nama: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Add index for efficient lookups
    },
    deskripsi: {
      type: String,
      trim: true,
    },
    kategori: {
      type: String,
      required: true,
      trim: true,
    },
    stok: {
      type: Number,
      required: true,
      min: 0,
    },
    satuan: {
      type: String,
      required: true,
      trim: true,
    },
    harga: {
      type: Number,
      required: true,
      min: 0,
    },
    kode_obat: {
      type: String,
      required: true,
      unique: true,
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
  { timestamps: true },
);

const Drug = model<IDrug>('Drug', DrugSchema);

export default Drug;
