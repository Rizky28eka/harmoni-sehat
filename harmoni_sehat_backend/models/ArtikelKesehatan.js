const mongoose = require('mongoose');

const ArtikelKesehatanSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  konten: {
    type: String,
    required: true,
  },
  penulis_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'penulis_type',
    required: true,
  },
  penulis_type: {
    type: String,
    required: true,
    enum: ['Admin', 'Dokter'],
  },
  status_publikasi: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
}, { timestamps: true });

module.exports = mongoose.model('ArtikelKesehatan', ArtikelKesehatanSchema);
