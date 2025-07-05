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
    trim: true,
  },
  isi: {
    type: String,
    default: '',
    trim: true,
  },
  tipe: {
    type: String,
    enum: ['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo', 'reminder', 'appointment'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true,
  },
  data_payload: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  is_push: {
    type: Boolean,
    default: false,
  },
  is_email: {
    type: Boolean,
    default: false,
  },
  is_sms: {
    type: Boolean,
    default: false,
  },
  scheduled_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  sent_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
NotifikasiSchema.index({ user_id: 1 });
NotifikasiSchema.index({ tipe: 1 });
NotifikasiSchema.index({ priority: 1 });
NotifikasiSchema.index({ is_read: 1 });
NotifikasiSchema.index({ is_push: 1 });
NotifikasiSchema.index({ scheduled_at: 1 });
NotifikasiSchema.index({ created_at: 1 });

module.exports = mongoose.model('Notifikasi', NotifikasiSchema);