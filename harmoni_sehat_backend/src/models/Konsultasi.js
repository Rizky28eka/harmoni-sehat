const mongoose = require('mongoose');

const KonsultasiSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  kode_konsultasi: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  keluhan_utama: {
    type: String,
    default: '',
    trim: true,
  },
  riwayat_penyakit: {
    type: String,
    default: '',
    trim: true,
  },
  gejala: {
    type: String,
    default: '',
    trim: true,
  },
  tanggal_konsultasi: {
    type: Date,
    required: true,
  },
  tanggal_selesai: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  anamnesis: {
    type: String,
    default: '',
    trim: true,
  },
  diagnosa: {
    type: String,
    default: '',
    trim: true,
  },
  tindakan: {
    type: String,
    default: '',
    trim: true,
  },
  catatan_dokter: {
    type: String,
    default: '',
    trim: true,
  },
  saran_dokter: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'waiting_payment', 'completed', 'cancelled'],
    required: true,
  },
  jenis_konsultasi: {
    type: String,
    enum: ['chat', 'video_call', 'voice_call'],
    required: true,
  },
  durasi_konsultasi: {
    type: Number,
    default: 0,
  },
  biaya: {
    type: Number,
    default: 0.00,
  },
  biaya_admin: {
    type: Number,
    default: 0.00,
  },
  total_biaya: {
    type: Number,
    default: 0.00,
  },
  rating_pasien: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  review_pasien: {
    type: String,
    default: '',
    trim: true,
  },
  rating_dokter: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  review_dokter: {
    type: String,
    default: '',
    trim: true,
  },
  is_emergency: {
    type: Boolean,
    default: false,
  },
  vital_signs: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  attachments: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
}, { timestamps: true });

// Indexes
KonsultasiSchema.index({ pasien_id: 1 });
KonsultasiSchema.index({ doctor_id: 1 });
KonsultasiSchema.index({ status: 1 });
KonsultasiSchema.index({ jenis_konsultasi: 1 });
KonsultasiSchema.index({ tanggal_konsultasi: 1 });
KonsultasiSchema.index({ is_emergency: 1 });
KonsultasiSchema.index({ rating_pasien: 1 });
KonsultasiSchema.index({ rating_dokter: 1 });

module.exports = mongoose.model('Konsultasi', KonsultasiSchema);