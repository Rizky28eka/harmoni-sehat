const mongoose = require('mongoose');

const ReviewDokterSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  dokter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dokter',
    required: true,
  },
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  komentar: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReviewDokter', ReviewDokterSchema);
