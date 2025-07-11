import { Document, Types } from 'mongoose';

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

export interface IMedicalRecordResponseDto {
  id: string;
  pasien_id: string;
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

export const toMedicalRecordResponseDto = (record: IMedicalRecord): IMedicalRecordResponseDto => ({
  id: (record._id as Types.ObjectId).toString(),
  pasien_id: (record.pasien_id as Types.ObjectId).toString(),
  tanggal_rekam_medis: record.tanggal_rekam_medis,
  diagnosis: record.diagnosis,
  catatan_dokter: record.catatan_dokter,
  resep_id: record.resep_id,
  riwayat_penyakit: record.riwayat_penyakit,
  alergi: record.alergi,
  tinggi_badan: record.tinggi_badan,
  berat_badan: record.berat_badan,
  tekanan_darah: record.tekanan_darah,
  suhu_tubuh: record.suhu_tubuh,
});
