import { Schema, model, Document } from 'mongoose';

export interface IClinic extends Document {
  nama: string;
  alamat: string;
  no_telepon: string;
  email?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema = new Schema<IClinic>({
  nama: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to not violate unique constraint
    lowercase: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

const Clinic = model<IClinic>('Clinic', ClinicSchema);

export default Clinic;