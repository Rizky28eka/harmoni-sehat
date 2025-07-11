import { Schema, model, Document, Types } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface IDokter extends Document {
  _id: string; // Custom ID
  user_id: Types.ObjectId;
  nama: string;
  nomor_str: string;
  spesialisasi_id?: Types.ObjectId;
  biaya_konsultasi: number;
  foto?: string;
  bio?: string;
  status: 'active' | 'inactive';
}

const DokterSchema = new Schema<IDokter>(
  {
    _id: {
      type: String,
      default: () => generateCustomId('10', 12), // Dokter ID starts with 10
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true, // Add index for efficient lookups
    },
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    nomor_str: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    spesialisasi_id: {
      type: Schema.Types.ObjectId,
      ref: 'Specialization',
      index: true, // Add index for efficient lookups
    },
    biaya_konsultasi: {
      type: Number,
      required: true,
      min: 0,
    },
    foto: {
      type: String,
    },
    bio: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { _id: false },
); // Disable default _id generation

const Dokter = model<IDokter>('Dokter', DokterSchema);

export default Dokter;
