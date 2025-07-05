const mongoose = require('mongoose');

const KategoriArtikelSchema = new mongoose.Schema({
  nama_kategori: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deskripsi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  icon: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  color: {
    type: String,
    default: '#3B82F6',
    trim: true,
  },
  urutan: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes
KategoriArtikelSchema.index({ is_active: 1 });
KategoriArtikelSchema.index({ urutan: 1 });

module.exports = mongoose.model('KategoriArtikel', KategoriArtikelSchema);