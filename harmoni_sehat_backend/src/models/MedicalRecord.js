const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true, // Made required as per user's no-null request for FKs
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  tanggal_rekam: {
    type: Date,
    required: true,
  },
  keluhan_utama: {
    type: String,
    default: '',
    trim: true,
  },
  anamnesis: {
    type: String,
    default: '',
    trim: true,
  },
  pemeriksaan_fisik: {
    type: String,
    default: '',
    trim: true,
  },
  pemeriksaan_penunjang: {
    type: String,
    default: '',
    trim: true,
  },
  diagnosa_utama: {
    type: String,
    default: '',
    trim: true,
  },
  diagnosa_sekunder: {
    type: String,
    default: '',
    trim: true,
  },
  terapi: {
    type: String,
    default: '',
    trim: true,
  },
  prognosis: {
    type: String,
    default: '',
    trim: true,
  },
  follow_up: {
    type: String,
    default: '',
    trim: true,
  },
  catatan_tambahan: {
    type: String,
    default: '',
    trim: true,
  },
  file_pendukung: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  is_confidential: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Indexes
MedicalRecordSchema.index({ pasien_id: 1 });
MedicalRecordSchema.index({ konsultasi_id: 1 });
MedicalRecordSchema.index({ doctor_id: 1 });
MedicalRecordSchema.index({ tanggal_rekam: 1 });
MedicalRecordSchema.index({ is_confidential: 1 });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);