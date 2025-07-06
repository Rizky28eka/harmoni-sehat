const mongoose = require('mongoose');

const DokterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
  },
  nomor_str: {
    type: String,
    unique: true,
  },
  spesialisasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spesialisasi', // Assuming Spesialisasi model will be created
  },
  biaya_konsultasi: {
    type: Number,
  },
  foto: {
    type: String,
  },
  bio: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Dokter', DokterSchema);