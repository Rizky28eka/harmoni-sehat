import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescription extends Document {
  _id: Types.ObjectId;
  consultation_id: Types.ObjectId;
  catatan?: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>({
  consultation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
    unique: true, // One prescription per consultation
  },
  catatan: {
    type: String,
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
{
  timestamps: true,
});

const Prescription = model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;
