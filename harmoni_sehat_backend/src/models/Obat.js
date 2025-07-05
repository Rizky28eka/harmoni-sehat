const mongoose = require('mongoose');

const ObatSchema = new mongoose.Schema({
  nama_obat: {
    type: String,
    required: true,
    trim: true,
  },
  nama_generik: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  kategori_obat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KategoriObat',
    required: true, // Made required as per user's no-null request for FKs
  },
  bentuk_obat: {
    type: String,
    enum: ['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes', 'gel', 'spray', 'inhaler'],
    required: true,
  },
  kemasan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  kandungan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  deskripsi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  indikasi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  kontraindikasi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  efek_samping: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  dosis_dewasa: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  dosis_anak: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  cara_pakai: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  cara_penyimpanan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  peringatan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  nomor_bpom: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  produsen: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  harga: {
    type: Number,
    default: 0.00,
  },
  foto_obat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  galeri_foto: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  is_resep_dokter: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  tanggal_kadaluarsa: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  barcode: {
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
}, { timestamps: true });

// Indexes
ObatSchema.index({ nama_obat: 1 });
ObatSchema.index({ nama_generik: 1 });
ObatSchema.index({ kategori_obat_id: 1 });
ObatSchema.index({ bentuk_obat: 1 });
ObatSchema.index({ produsen: 1 });
ObatSchema.index({ nomor_bpom: 1 });
ObatSchema.index({ is_resep_dokter: 1 });
ObatSchema.index({ is_active: 1 });
ObatSchema.index({ barcode: 1 });
ObatSchema.index({ rating: 1 });

module.exports = mongoose.model('Obat', ObatSchema);