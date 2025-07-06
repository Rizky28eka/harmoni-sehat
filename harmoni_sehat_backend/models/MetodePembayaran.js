const mongoose = require('mongoose');

const MetodePembayaranSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
  kode: {
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

module.exports = mongoose.model('MetodePembayaran', MetodePembayaranSchema);