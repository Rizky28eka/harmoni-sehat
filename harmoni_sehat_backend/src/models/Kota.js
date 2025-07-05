const mongoose = require('mongoose');

const KotaSchema = new mongoose.Schema({
  provinsi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provinsi',
    required: true,
  },
  nama_kota: {
    type: String,
    required: true,
    trim: true,
  },
  kode_kota: {
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
KotaSchema.index({ provinsi_id: 1 });
KotaSchema.index({ nama_kota: 1 });
KotaSchema.index({ is_active: 1 });

// Composite unique constraint
KotaSchema.index({ provinsi_id: 1, nama_kota: 1 }, { unique: true });

module.exports = mongoose.model('Kota', KotaSchema);