const mongoose = require('mongoose');

const NotifikasiSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  judul: {
    type: String,
    required: true,
  },
  isi: {
    type: String,
    required: true,
  },
  tipe: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'appointment', 'order'],
    default: 'info',
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notifikasi', NotifikasiSchema);
