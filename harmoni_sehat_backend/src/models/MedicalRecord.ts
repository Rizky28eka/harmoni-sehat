import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalRecord extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  pasien_id: {
    type: String,
    ref: 'Pasien',
    required: true,
    unique: true,
  },
  riwayat_penyakit: {
    type: [String],
  },
  alergi: {
    type: [String],
  },
  riwayat_vaksinasi: {
    type: [String],
  },
}, { timestamps: true });

const MedicalRecord = model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);

export default MedicalRecord;
