const mongoose = require('mongoose');

const TransaksiSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total_biaya: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  metode_pembayaran_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MetodePembayaran',
  },
  external_id: {
    type: String,
  },
  transaksiable_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  transaksiable_type: {
    type: String,
    required: true,
    enum: ['Konsultasi', 'PesananObat'], // Assuming these are the only types for now
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaksi', TransaksiSchema);