const mongoose = require('mongoose');

const DetailResepSchema = new mongoose.Schema({
  resep_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resep',
    required: true,
  },
  obat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obat',
    required: true,
  },
  dosis: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  aturan_pakai: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  catatan_khusus: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  harga_satuan: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  subtotal: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  is_tersedia: {
    type: Boolean,
    default: true,
  },
  alasan_tidak_tersedia: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  obat_pengganti_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obat',
    required: true, // Made required as per user's no-null request for FKs
  },
}, { timestamps: true });

// Indexes
DetailResepSchema.index({ resep_id: 1 });
DetailResepSchema.index({ obat_id: 1 });
DetailResepSchema.index({ obat_pengganti_id: 1 });
DetailResepSchema.index({ is_tersedia: 1 });

module.exports = mongoose.model('DetailResep', DetailResepSchema);