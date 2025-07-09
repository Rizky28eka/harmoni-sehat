import { Schema, model, Document, Types } from 'mongoose';

export interface ISpecialization extends Document {
  _id: Types.ObjectId;
  nama: string;
  deskripsi?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const specializationSchema = new Schema<ISpecialization>({
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
},
{
  timestamps: true,
});

const Specialization = model<ISpecialization>('Specialization', specializationSchema);

export default Specialization;
