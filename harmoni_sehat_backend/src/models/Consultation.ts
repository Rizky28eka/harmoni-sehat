import { Schema, model, Document, Types } from 'mongoose';

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  patient_id: Types.ObjectId;
  doctor_id: Types.ObjectId;
  schedule_id: Types.ObjectId; // Reference to PracticeSchedule
  tanggal: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  schedule_id: {
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
    enum: ['scheduled', 'completed', 'cancelled', 'pending'],
    default: 'pending',
  },
  keluhan: {
    type: String,
    required: true,
  },
  diagnosa: {
    type: String,
  },
  tindakan: {
    type: String,
  },
  catatan_dokter: {
    type: String,
  },
  video_call_url: {
    type: String,
  },
},
{
  timestamps: true,
});

const Consultation = model<IConsultation>('Consultation', consultationSchema);

export default Consultation;
