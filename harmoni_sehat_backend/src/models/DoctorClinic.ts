import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctorClinic extends Document {
  dokter_id: string; // Refers to Dokter's custom _id
  klinik_id: Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DoctorClinicSchema = new Schema<IDoctorClinic>(
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
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

const DoctorClinic = model<IDoctorClinic>('DoctorClinic', DoctorClinicSchema);

export default DoctorClinic;
