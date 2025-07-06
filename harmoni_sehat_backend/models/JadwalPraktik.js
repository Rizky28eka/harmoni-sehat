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
    enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
  },
  jam_mulai: {
    type: String, // e.g., '09:00'
    required: true,
  },
  jam_selesai: {
    type: String, // e.g., '17:00'
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('JadwalPraktik', JadwalPraktikSchema);
