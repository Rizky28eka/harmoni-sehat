const mongoose = require('mongoose');

const ArtikelKesehatanSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  ringkasan: {
    type: String,
    default: '',
    trim: true,
  },
  konten: {
    type: String,
    default: '',
    trim: true,
  },
  kategori_artikel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KategoriArtikel',
    required: true, // Made required as per user's no-null request for FKs
  },
  penulis_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  penulis: {
    type: String,
    default: '',
    trim: true,
  },
  gambar_utama: {
    type: String,
    default: '',
    trim: true,
  },
  galeri_gambar: {
    type: Array,
    default: [],
  },
  tags: {
    type: Array,
    default: [],
  },
  meta_description: {
    type: String,
    default: '',
    trim: true,
  },
  meta_keywords: {
    type: String,
    default: '',
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  waktu_baca: {
    type: Number,
    default: 5,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft',
    required: true,
  },
  tanggal_publish: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Indexes
ArtikelKesehatanSchema.index({ kategori_artikel_id: 1 });
ArtikelKesehatanSchema.index({ penulis_id: 1 });
ArtikelKesehatanSchema.index({ is_published: 1 });
ArtikelKesehatanSchema.index({ is_featured: 1 });
ArtikelKesehatanSchema.index({ status: 1 });
ArtikelKesehatanSchema.index({ tanggal_publish: 1 });
ArtikelKesehatanSchema.index({ views: 1 });
ArtikelKesehatanSchema.index({ likes: 1 });

module.exports = mongoose.model('ArtikelKesehatan', ArtikelKesehatanSchema);