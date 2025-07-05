const mongoose = require('mongoose');

const KurirSchema = new mongoose.Schema({
  nama_kurir: {
    type: String,
    required: true,
    trim: true,
  },
  no_telepon: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  kendaraan: {
    type: String,
    enum: ['motor', 'mobil', 'sepeda'],
    required: true,
  },
  nomor_plat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  foto_profil: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  foto_kendaraan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  foto_stnk: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  foto_sim: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  rating: {
    type: Number,
    default: 0.00,
  },
  total_reviews: {
    type: Number,
    default: 0,
  },
  total_pengiriman: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_online: {
    type: Boolean,
    default: false,
  },
  area_layanan: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  koordinat_lat: {
    type: Number,
    default: 0,
  },
  koordinat_lng: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Indexes
KurirSchema.index({ nama_kurir: 1 });
KurirSchema.index({ is_active: 1 });
KurirSchema.index({ is_verified: 1 });
KurirSchema.index({ is_online: 1 });
KurirSchema.index({ rating: 1 });
KurirSchema.index({ koordinat_lat: 1, koordinat_lng: 1 });

module.exports = mongoose.model('Kurir', KurirSchema);