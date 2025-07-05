const mongoose = require('mongoose');

const JadwalDoctorSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  hari: {
    type: String,
    enum: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'],
    required: true,
  },
  jam_mulai: {
    type: String, // Storing as string for time format
    required: true,
  },
  jam_selesai: {
    type: String, // Storing as string for time format
    required: true,
  },
  quota_pasien: {
    type: Number,
    default: 10,
  },
  durasi_konsultasi: {
    type: Number,
    default: 30,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  catatan: {
    type: String,
    default: '',
    trim: true,
  },
  tipe_jadwal: {
    type: String,
    enum: ['reguler', 'khusus', 'emergency'],
    default: 'reguler',
    required: true,
  },
  tanggal_khusus: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Indexes
JadwalDoctorSchema.index({ is_available: 1 });
JadwalDoctorSchema.index({ tipe_jadwal: 1 });

// Unique constraint for doctor's schedule
JadwalDoctorSchema.index({ doctor_id: 1, hari: 1, jam_mulai: 1, tanggal_khusus: 1 }, { unique: true });

module.exports = mongoose.model('JadwalDoctor', JadwalDoctorSchema);