const mongoose = require('mongoose');

const KonsultasiSchema = new mongoose.Schema({
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
  jadwal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JadwalPraktik',
  },
  tanggal: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending',
  },
  keluhan: {
    type: String,
  },
  diagnosa: {
    type: String,
  },
  tindakan: {
    type: String,
  },
  catatan_dokter: {
    type: String,
  },
  video_call_url: {
    type: String,
  },
});

module.exports = mongoose.model('Konsultasi', KonsultasiSchema);