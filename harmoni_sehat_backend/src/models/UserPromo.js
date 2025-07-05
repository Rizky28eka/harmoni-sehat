const mongoose = require('mongoose');

const UserPromoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  promo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promo',
    required: true,
  },
  pembayaran_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pembayaran',
    required: true, // Made required as per user's no-null request for FKs
  },
  tanggal_digunakan: {
    type: Date,
    default: Date.now,
  },
  nilai_diskon_diterima: {
    type: Number,
    default: 0.00, // Default to 0 instead of null
  },
  status: {
    type: String,
    enum: ['used', 'expired', 'cancelled'],
    default: 'used',
    required: true,
  },
}, { timestamps: true });

// Indexes
UserPromoSchema.index({ status: 1 });
UserPromoSchema.index({ tanggal_digunakan: 1 });

// Unique constraint to prevent duplicate usage
UserPromoSchema.index({ user_id: 1, promo_id: 1, pembayaran_id: 1 }, { unique: true });

module.exports = mongoose.model('UserPromo', UserPromoSchema);