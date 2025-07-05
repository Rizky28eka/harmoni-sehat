const mongoose = require('mongoose');

const VitalSignsSchema = new mongoose.Schema({
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
  medical_record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true, // Made required as per user's no-null request for FKs
  },
  tanggal_periksa: {
    type: Date,
    default: Date.now,
  },
  tekanan_darah_sistolik: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  tekanan_darah_diastolik: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  denyut_nadi: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  suhu_tubuh: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  respiratory_rate: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  berat_badan: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  tinggi_badan: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  bmi: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  saturasi_oksigen: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  gula_darah: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  kolesterol: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  asam_urat: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  catatan: {
    type: String,
    default: '',
    trim: true,
  },
  kondisi_umum: {
    type: String,
    enum: ['baik', 'sedang', 'buruk'],
    default: 'baik',
    required: true,
  },
}, { timestamps: true });

// Indexes
VitalSignsSchema.index({ pasien_id: 1 });
VitalSignsSchema.index({ konsultasi_id: 1 });
VitalSignsSchema.index({ medical_record_id: 1 });
VitalSignsSchema.index({ tanggal_periksa: 1 });
VitalSignsSchema.index({ kondisi_umum: 1 });

module.exports = mongoose.model('VitalSigns', VitalSignsSchema);