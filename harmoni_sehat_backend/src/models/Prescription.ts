import { ownerScope } from '../plugins/ownerScope';
import { prescriptionScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescription extends Document {
  konsultasi_id: Types.ObjectId;
  pasien_id?: string;
  dokter_id?: string;
  catatan?: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    konsultasi_id: {
      type: Schema.Types.ObjectId,
      ref: 'Consultation',
      required: true,
      unique: true,
      index: true, // Add index for efficient lookups
    },
    pasien_id: { type: String, ref: 'Pasien', index: true },
    dokter_id: { type: String, ref: 'Dokter', index: true },
    catatan: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    expired_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

ownerScope(PrescriptionSchema, prescriptionScope);

const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);

export default Prescription;
