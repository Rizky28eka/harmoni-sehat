import { Schema, model, Document, Types } from 'mongoose';

export interface IPracticeSchedule extends Document {
  _id: Types.ObjectId;
  doctor_id: Types.ObjectId;
  clinic_id: Types.ObjectId;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string; // e.g., "09:00"
  jam_selesai: string; // e.g., "17:00"
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const practiceScheduleSchema = new Schema<IPracticeSchedule>({
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  clinic_id: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  hari: {
    type: String,
    enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    required: true,
    trim: true,
  },
  jam_mulai: {
    type: String,
    required: true,
    trim: true,
  },
  jam_selesai: {
    type: String,
    required: true,
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
});

const PracticeSchedule = model<IPracticeSchedule>('PracticeSchedule', practiceScheduleSchema);

export default PracticeSchedule;
