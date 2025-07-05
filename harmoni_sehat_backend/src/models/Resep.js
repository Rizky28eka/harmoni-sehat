const mongoose = require('mongoose');

const ResepSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true, // Made required as per user's no-null request for FKs
    unique: true, // Unique constraint from Knex
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  apotek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apotek',
    required: true, // Made required as per user's no-null request for FKs
  },
  kode_resep: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tanggal_resep: {
    type: Date,
    default: Date.now,
  },
  tanggal_kadaluarsa: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  catatan_resep: {
    type: String,
    default: '',
    trim: true,
  },
  aturan_umum: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled'],
    required: true,
  },
  jenis_resep: {
    type: String,
    enum: ['tunai', 'bpjs', 'asuransi'],
    default: 'tunai',
    required: true,
  },
  total_harga: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  biaya_pengiriman: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  biaya_admin: {
    type: Number,
    default: 0.00,
  },
  total_bayar: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  is_urgent: {
    type: Boolean,
    default: false,
  },
  alamat_pengiriman: {
    type: String,
    default: '',
    trim: true,
  },
  koordinat_pengiriman: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
}, { timestamps: true });

// Indexes
ResepSchema.index({ doctor_id: 1 });
ResepSchema.index({ pasien_id: 1 });
ResepSchema.index({ apotek_id: 1 });
ResepSchema.index({ status: 1 });
ResepSchema.index({ jenis_resep: 1 });
ResepSchema.index({ tanggal_resep: 1 });
ResepSchema.index({ is_urgent: 1 });

module.exports = mongoose.model('Resep', ResepSchema);