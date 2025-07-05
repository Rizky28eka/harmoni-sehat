const mongoose = require('mongoose');

const KategoriObatSchema = new mongoose.Schema({
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
    default: '#10B981',
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes
KategoriObatSchema.index({ is_active: 1 });

module.exports = mongoose.model('KategoriObat', KategoriObatSchema);