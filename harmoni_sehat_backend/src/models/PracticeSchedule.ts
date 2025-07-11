import { Schema, model, Document, Types } from 'mongoose';

export interface IPracticeSchedule extends Document {
  dokter_id: string; // Refers to Dokter's custom _id
  klinik_id: Types.ObjectId;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string;
  jam_selesai: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeScheduleSchema = new Schema<IPracticeSchedule>(
  {
    dokter_id: {
      type: String,
      ref: 'Dokter',
      required: true,
      index: true, // Add index for efficient lookups
    },
    klinik_id: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
      index: true, // Add index for efficient lookups
    },
    hari: {
      type: String,
      required: true,
      enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    },
    jam_mulai: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
    },
    jam_selesai: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const PracticeSchedule = model<IPracticeSchedule>('PracticeSchedule', PracticeScheduleSchema);

export default PracticeSchedule;
