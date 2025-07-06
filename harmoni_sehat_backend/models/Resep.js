const mongoose = require('mongoose');

const ResepSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true,
    unique: true,
  },
  catatan: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'filled', 'cancelled'],
    default: 'pending',
  },
  expired_at: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Resep', ResepSchema);
