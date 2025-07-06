const mongoose = require('mongoose');

const DokterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nomor_str: {
    type: String,
    unique: true,
  },
  spesialisasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spesialisasi',
  },
  biaya_konsultasi: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Dokter', DokterSchema);
