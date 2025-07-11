import { Schema, model, Document, Types } from 'mongoose';

export interface IConsultation extends Document {
  pasien_id: Types.ObjectId; // Refers to Pasien's custom _id
  dokter_id: Types.ObjectId; // Refers to Dokter's custom _id
  jadwal_id: Types.ObjectId;
  tanggal: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
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
      type: Schema.Types.ObjectId,
      ref: 'Pasien',
      required: true,
      index: true, // Add index for efficient lookups
    },
    dokter_id: {
      type: Schema.Types.ObjectId,
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
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
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

const Consultation = model<IConsultation>('Consultation', ConsultationSchema);

export default Consultation;
