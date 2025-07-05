const mongoose = require('mongoose');

const ProvinsiSchema = new mongoose.Schema({
  nama_provinsi: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  kode_provinsi: {
    type: String,
    unique: true,
    required: true, // Made required to avoid null/undefined as per user request
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes for performance
ProvinsiSchema.index({ is_active: 1 });

module.exports = mongoose.model('Provinsi', ProvinsiSchema);