const mongoose = require('mongoose');

const SpesialisasiSchema = new mongoose.Schema({
  nama_spesialisasi: {
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
    default: '#6366F1',
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes
SpesialisasiSchema.index({ is_active: 1 });

module.exports = mongoose.model('Spesialisasi', SpesialisasiSchema);