const mongoose = require('mongoose');

const ApotekSchema = new mongoose.Schema({
  nama_apotek: {
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
  foto_apotek: {
    type: String,
    default: '',
    trim: true,
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
  no_sipa: {
    type: String,
    default: '',
    trim: true,
  },
  pemilik: {
    type: String,
    default: '',
    trim: true,
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
ApotekSchema.index({ nama_apotek: 1 });
ApotekSchema.index({ is_active: 1 });
ApotekSchema.index({ is_24_jam: 1 });
ApotekSchema.index({ rating: 1 });
ApotekSchema.index({ koordinat_lat: 1, koordinat_lng: 1 });
ApotekSchema.index({ provinsi_id: 1, kota_id: 1 });

module.exports = mongoose.model('Apotek', ApotekSchema);