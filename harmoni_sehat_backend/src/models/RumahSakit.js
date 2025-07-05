const mongoose = require('mongoose');

const RumahSakitSchema = new mongoose.Schema({
  nama_rumah_sakit: {
    type: String,
    required: true,
    trim: true,
  },
  alamat: {
    type: String,
    default: '',
    trim: true,
  },
  no_telepon: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    default: '',
    trim: true,
  },
  website: {
    type: String,
    default: '',
    trim: true,
  },
  tipe_rumah_sakit: {
    type: String,
    enum: ['pemerintah', 'swasta', 'militer'],
    required: true,
  },
  kelas_rumah_sakit: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true,
  },
  koordinat_lat: {
    type: Number,
    default: 0,
  },
  koordinat_lng: {
    type: Number,
    default: 0,
  },
  foto_rumah_sakit: {
    type: String,
    default: '',
    trim: true,
  },
  galeri_foto: {
    type: Array,
    default: [],
  },
  fasilitas: {
    type: Array,
    default: [],
  },
  layanan: {
    type: Array,
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0.00,
  },
  total_reviews: {
    type: Number,
    default: 0,
  },
  provinsi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provinsi',
    required: true, // Made required as per user's no-null request for FKs
  },
  kota_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kota',
    required: true, // Made required as per user's no-null request for FKs
  },
}, { timestamps: true });

// Indexes
RumahSakitSchema.index({ nama_rumah_sakit: 1 });
RumahSakitSchema.index({ tipe_rumah_sakit: 1 });
RumahSakitSchema.index({ kelas_rumah_sakit: 1 });
RumahSakitSchema.index({ is_active: 1 });
RumahSakitSchema.index({ rating: 1 });
RumahSakitSchema.index({ koordinat_lat: 1, koordinat_lng: 1 });
RumahSakitSchema.index({ provinsi_id: 1, kota_id: 1 });

module.exports = mongoose.model('RumahSakit', RumahSakitSchema);