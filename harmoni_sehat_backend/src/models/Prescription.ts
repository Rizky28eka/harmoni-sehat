import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescription extends Document {
  konsultasi_id: Types.ObjectId;
  catatan?: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>({
  konsultasi_id: {
    type: Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
    unique: true,
  },
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
}, { timestamps: true });

const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);

export default Prescription;