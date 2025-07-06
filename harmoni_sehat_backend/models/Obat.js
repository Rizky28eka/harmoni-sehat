const mongoose = require('mongoose');

const ObatSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
  },
  kategori: {
    type: String,
  },
  stok: {
    type: Number,
    default: 0,
  },
  satuan: {
    type: String,
  },
  harga: {
    type: Number,
    required: true,
  },
  kode_obat: {
    type: String,
    unique: true,
  },
  butuh_resep: {
    type: Boolean,
    default: false,
  },
  tgl_kadaluarsa: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Obat', ObatSchema);