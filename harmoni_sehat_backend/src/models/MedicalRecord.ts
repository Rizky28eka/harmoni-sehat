

import { Schema, model, Types, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  pasien_id: Types.ObjectId;
  tanggal_rekam_medis: Date;
  diagnosis: string;
  catatan_dokter?: string;
  resep_id?: string;
  riwayat_penyakit?: string[];
  alergi?: string[];
  tinggi_badan?: number;
  berat_badan?: number;
  tekanan_darah?: string;
  suhu_tubuh?: number;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  pasien_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Pasien',
  },
  tanggal_rekam_medis: {
    type: Date,
    default: Date.now,
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis harus diisi'],
    trim: true,
  },
  catatan_dokter: {
    type: String,
    trim: true,
  },
  resep_id: {
    type: Types.ObjectId,
    ref: 'Prescription',
  },
  riwayat_penyakit: {
    type: [String],
  },
  alergi: {
    type: [String],
  },
  tinggi_badan: Number,
  berat_badan: Number,
  tekanan_darah: String,
  suhu_tubuh: Number,
});

const MedicalRecord = model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);

export default MedicalRecord;
