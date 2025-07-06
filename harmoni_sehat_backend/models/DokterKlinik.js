const mongoose = require('mongoose');

const DokterKlinikSchema = new mongoose.Schema({
  dokter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dokter',
    required: true,
  },
  klinik_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Klinik',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = mongoose.model('DokterKlinik', DokterKlinikSchema);