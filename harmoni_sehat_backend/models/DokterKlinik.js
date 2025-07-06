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

DokterKlinikSchema.index({ dokter_id: 1, klinik_id: 1 }, { unique: true });

module.exports = mongoose.model('DokterKlinik', DokterKlinikSchema);
