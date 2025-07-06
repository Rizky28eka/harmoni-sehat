const mongoose = require('mongoose');

const SpesialisasiSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
  deskripsi: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Spesialisasi', SpesialisasiSchema);