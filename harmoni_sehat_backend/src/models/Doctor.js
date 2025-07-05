const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true,
  },
  no_sip: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  spesialisasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spesialisasi',
    required: true, // Made required as per user's no-null request for FKs
  },
  pengalaman_tahun: {
    type: Number,
    default: 0,
  },
  tarif_konsultasi: {
    type: Number,
    default: 0.00,
  },
  rumah_sakit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RumahSakit',
    required: true, // Made required as per user's no-null request for FKs
  },
  klinik_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Klinik',
    required: true, // Made required as per user's no-null request for FKs
  },
  rating: {
    type: Number,
    default: 0.00,
  },
  total_reviews: {
    type: Number,
    default: 0,
  },
  total_konsultasi: {
    type: Number,
    default: 0,
  },
  total_pasien: {
    type: Number,
    default: 0,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  foto_profil: {
    type: String,
    default: '',
    trim: true,
  },
  alumnus: {
    type: String,
    default: '',
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  sertifikasi: {
    type: Array,
    default: [],
  },
  jadwal_praktek: {
    type: Array,
    default: [],
  },
  metode_konsultasi: {
    type: Array,
    default: ['chat', 'video_call', 'voice_call'],
  },
  tanggal_lahir: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  jenis_kelamin: {
    type: String,
    enum: ['L', 'P'],
    default: 'L', // Default to a valid enum value
  },
  alamat: {
    type: String,
    default: '',
    trim: true,
  },
  no_str: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true });

// Indexes
DoctorSchema.index({ no_str: 1 });
DoctorSchema.index({ spesialisasi_id: 1 });
DoctorSchema.index({ rumah_sakit_id: 1 });
DoctorSchema.index({ klinik_id: 1 });
DoctorSchema.index({ is_verified: 1 });
DoctorSchema.index({ is_available: 1 });
DoctorSchema.index({ rating: 1 });
DoctorSchema.index({ tarif_konsultasi: 1 });

module.exports = mongoose.model('Doctor', DoctorSchema);