const mongoose = require('mongoose');

const KlinikSchema = new mongoose.Schema({
  nama_klinik: {
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
  jam_buka: {
    type: String, // Storing as string for time format
    default: '00:00',
  },
  jam_tutup: {
    type: String, // Storing as string for time format
    default: '00:00',
  },
  koordinat_lat: {
    type: Number,
    default: 0,
  },
  koordinat_lng: {
    type: Number,
    default: 0,
  },
  foto_klinik: {
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
  is_24_jam: {
    type: Boolean,
    default: false,
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
  tipe_klinik: {
    type: String,
    enum: ['pratama', 'utama'],
    required: true,
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
KlinikSchema.index({ nama_klinik: 1 });
KlinikSchema.index({ tipe_klinik: 1 });
KlinikSchema.index({ is_active: 1 });
KlinikSchema.index({ is_24_jam: 1 });
KlinikSchema.index({ rating: 1 });
KlinikSchema.index({ koordinat_lat: 1, koordinat_lng: 1 });
KlinikSchema.index({ provinsi_id: 1, kota_id: 1 });

module.exports = mongoose.model('Klinik', KlinikSchema);