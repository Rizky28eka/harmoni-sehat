const mongoose = require('mongoose');

const JadwalPraktikSchema = new mongoose.Schema({
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
  hari: {
    type: String,
    required: true,
  },
  jam_mulai: {
    type: String,
    required: true,
  },
  jam_selesai: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('JadwalPraktik', JadwalPraktikSchema);