import { Schema, model, Document } from 'mongoose';

export interface ISpecialization extends Document {
  nama: string;
  deskripsi?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SpecializationSchema = new Schema<ISpecialization>({
  nama: {
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
}, { timestamps: true });

const Specialization = model<ISpecialization>('Specialization', SpecializationSchema);

export default Specialization;