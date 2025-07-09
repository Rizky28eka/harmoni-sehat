import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  nama: string;
  nomor_str: string;
  specialization_id: Types.ObjectId; // Reference to Specialization model
  biaya_konsultasi: number;
  foto?: string; // URL to photo
  bio?: string;
  status: 'active' | 'inactive' | 'pending';
}

const doctorSchema = new Schema<IDoctor>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
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
  specialization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Specialization',
    required: true,
  },
  biaya_konsultasi: {
    type: Number,
    required: true,
  },
  foto: {
    type: String,
  },
  bio: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
},
{
  timestamps: true,
});

const Doctor = model<IDoctor>('Doctor', doctorSchema);

export default Doctor;
