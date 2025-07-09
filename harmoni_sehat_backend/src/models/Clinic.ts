import { Schema, model, Document, Types } from 'mongoose';

export interface IClinic extends Document {
  _id: Types.ObjectId;
  nama: string;
  alamat: string;
  no_telepon: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const clinicSchema = new Schema<IClinic>({
  nama: {
    type: String,
    required: true,
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
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
},
{
  timestamps: true,
});

const Clinic = model<IClinic>('Clinic', clinicSchema);

export default Clinic;
