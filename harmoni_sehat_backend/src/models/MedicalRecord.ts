import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalRecord extends Document {
  _id: Types.ObjectId;
  patient_id: Types.ObjectId;
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
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
},
{
  timestamps: true,
});

const MedicalRecord = model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;