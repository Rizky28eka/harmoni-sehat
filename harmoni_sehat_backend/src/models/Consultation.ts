import { ownerScope } from '../plugins/ownerScope';
import { consultationScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface IConsultation extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  dokter_id: string; // Refers to Dokter's custom _id
  jadwal_id: Types.ObjectId;
  tanggal: Date;
  status: 'pending' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  biaya: number;
  slot_key?: string;
  expires_at?: Date;
  cancel_reason?: string;
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    pasien_id: {
      type: String,
      ref: 'Pasien',
      required: true,
      index: true, // Add index for efficient lookups
    },
    dokter_id: {
      type: String,
      ref: 'Dokter',
      required: true,
      index: true, // Add index for efficient lookups
    },
    jadwal_id: {
      type: Schema.Types.ObjectId,
      ref: 'PracticeSchedule',
      required: true,
    },
    tanggal: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    biaya: { type: Number, default: 0, min: 0 },
    slot_key: { type: String, unique: true, sparse: true },
    expires_at: { type: Date },
    cancel_reason: { type: String, trim: true },
    keluhan: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosa: {
      type: String,
      trim: true,
    },
    tindakan: {
      type: String,
      trim: true,
    },
    catatan_dokter: {
      type: String,
      trim: true,
    },
    video_call_url: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

ownerScope(ConsultationSchema, consultationScope);

const Consultation = model<IConsultation>('Consultation', ConsultationSchema);

export default Consultation;
