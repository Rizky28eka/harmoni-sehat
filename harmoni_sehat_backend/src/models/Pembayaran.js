const mongoose = require('mongoose');

const PembayaranSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true, // Made required as per user's no-null request for FKs
  },
  resep_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resep',
    required: true, // Made required as per user's no-null request for FKs
  },
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  kode_pembayaran: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  jenis_pembayaran: {
    type: String,
    enum: ['konsultasi', 'obat', 'keduanya'],
    required: true,
  },
  jumlah_bayar: {
    type: Number,
    required: true,
  },
  biaya_admin: {
    type: Number,
    default: 0.00,
  },
  diskon: {
    type: Number,
    default: 0.00,
  },
  total_bayar: {
    type: Number,
    required: true,
  },
  metode_pembayaran: {
    type: String,
    enum: ['transfer', 'ewallet', 'va', 'kartu_kredit', 'qris', 'cod'],
    required: true,
  },
  provider_pembayaran: {
    type: String,
    default: '',
    trim: true,
  },
  status_pembayaran: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'refunded', 'expired'],
    required: true,
  },
  tanggal_pembayaran: {
    type: Date,
    default: Date.now,
  },
  tanggal_kadaluarsa: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  tanggal_berhasil: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  payment_gateway_id: {
    type: String,
    default: '',
    trim: true,
  },
  payment_gateway_response: {
    type: String,
    default: '',
    trim: true,
  },
  virtual_account: {
    type: String,
    default: '',
    trim: true,
  },
  qr_code: {
    type: String,
    default: '',
    trim: true,
  },
  bukti_pembayaran: {
    type: String,
    default: '',
    trim: true,
  },
  catatan_pembayaran: {
    type: String,
    default: '',
    trim: true,
  },
  fee_payment_gateway: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Indexes
PembayaranSchema.index({ konsultasi_id: 1 });
PembayaranSchema.index({ resep_id: 1 });
PembayaranSchema.index({ pasien_id: 1 });
PembayaranSchema.index({ jenis_pembayaran: 1 });
PembayaranSchema.index({ metode_pembayaran: 1 });
PembayaranSchema.index({ status_pembayaran: 1 });
PembayaranSchema.index({ tanggal_pembayaran: 1 });
PembayaranSchema.index({ payment_gateway_id: 1 });

module.exports = mongoose.model('Pembayaran', PembayaranSchema);