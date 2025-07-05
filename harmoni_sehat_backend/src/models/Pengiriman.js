const mongoose = require('mongoose');

const PengirimanSchema = new mongoose.Schema({
  resep_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resep',
    required: true,
    unique: true,
  },
  kurir_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kurir',
    required: true, // Made required as per user's no-null request for FKs
  },
  alamat_pengiriman: {
    type: String,
    required: true,
    trim: true,
  },
  koordinat_lat: {
    type: Number,
    default: 0,
  },
  koordinat_lng: {
    type: Number,
    default: 0,
  },
  nama_penerima: {
    type: String,
    required: true,
    trim: true,
  },
  no_telepon_penerima: {
    type: String,
    required: true,
    trim: true,
  },
  tanggal_kirim: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  estimasi_tiba: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  tanggal_terima: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  status_pengiriman: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'on_delivery', 'delivered', 'returned', 'cancelled'],
    required: true,
  },
  catatan_pengiriman: {
    type: String,
    default: '',
    trim: true,
  },
  catatan_kurir: {
    type: String,
    default: '',
    trim: true,
  },
  foto_bukti_terima: {
    type: String,
    default: '',
    trim: true,
  },
  biaya_pengiriman: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  jarak_km: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  tracking_history: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  no_resi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
}, { timestamps: true });

// Indexes
PengirimanSchema.index({ kurir_id: 1 });
PengirimanSchema.index({ status_pengiriman: 1 });
PengirimanSchema.index({ tanggal_kirim: 1 });
PengirimanSchema.index({ no_resi: 1 });
PengirimanSchema.index({ koordinat_lat: 1, koordinat_lng: 1 });

module.exports = mongoose.model('Pengiriman', PengirimanSchema);