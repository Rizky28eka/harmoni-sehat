const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  kode_promo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nama_promo: {
    type: String,
    required: true,
    trim: true,
  },
  deskripsi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  tipe_diskon: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_one_get_one'],
    required: true,
  },
  nilai_diskon: {
    type: Number,
    required: true,
  },
  minimum_pembelian: {
    type: Number,
    default: 0.00,
  },
  maksimum_diskon: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  tanggal_mulai: {
    type: Date,
    required: true,
  },
  tanggal_berakhir: {
    type: Date,
    required: true,
  },
  quota_penggunaan: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  sudah_digunakan: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  banner_promo: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  syarat_ketentuan: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  target_user: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  kategori_produk: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  is_first_time_only: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Indexes
PromoSchema.index({ tipe_diskon: 1 });
PromoSchema.index({ tanggal_mulai: 1 });
PromoSchema.index({ tanggal_berakhir: 1 });
PromoSchema.index({ is_active: 1 });
PromoSchema.index({ is_first_time_only: 1 });

module.exports = mongoose.model('Promo', PromoSchema);