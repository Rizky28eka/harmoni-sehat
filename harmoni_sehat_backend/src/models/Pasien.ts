import { Schema, model, Document, Types } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface IPasien extends Document {
  _id: string; // Custom ID
  user_id: Types.ObjectId;
  nama: string;
  nik: string;
  tanggal_lahir: Date;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon: string;
}

const PasienSchema = new Schema<IPasien>(
  {
    _id: {
      type: String,
      default: () => generateCustomId('08', 12), // Pasien ID starts with 08
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
    nik: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 16,
      maxlength: 16,
    },
    tanggal_lahir: {
      type: Date,
      required: true,
    },
    jenis_kelamin: {
      type: String,
      enum: ['Laki-laki', 'Perempuan'],
      required: true,
    },
    alamat: {
      type: String,
      required: true,
      trim: true,
    },
    no_telepon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
); // Disable default _id generation

const Pasien = model<IPasien>('Pasien', PasienSchema);

export default Pasien;
