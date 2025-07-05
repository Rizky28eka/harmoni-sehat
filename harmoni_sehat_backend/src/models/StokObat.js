const mongoose = require('mongoose');

const StokObatSchema = new mongoose.Schema({
  obat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obat',
    required: true,
  },
  apotek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apotek',
    required: true,
  },
  jumlah_stok: {
    type: Number,
    required: true,
  },
  stok_minimum: {
    type: Number,
    default: 0,
  },
  stok_reserved: {
    type: Number,
    default: 0,
  },
  tanggal_kadaluarsa: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  harga_beli: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  harga_jual: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  margin_profit: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  batch_number: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  last_updated: {
    type: Date,
    default: Date.now, // Equivalent to CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  },
}, { timestamps: true });

// Indexes
StokObatSchema.index({ is_available: 1 });
StokObatSchema.index({ tanggal_kadaluarsa: 1 });
StokObatSchema.index({ batch_number: 1 });
StokObatSchema.index({ jumlah_stok: 1 });

// Unique constraint for drug-pharmacy-batch combination
StokObatSchema.index({ obat_id: 1, apotek_id: 1, batch_number: 1 }, { unique: true });

module.exports = mongoose.model('StokObat', StokObatSchema);