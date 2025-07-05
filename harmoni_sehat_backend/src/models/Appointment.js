const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  kode_appointment: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tanggal_appointment: {
    type: Date,
    required: true,
  },
  jam_appointment: {
    type: String, // Storing as string for time format
    required: true,
  },
  estimasi_selesai: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  keluhan: {
    type: String,
    default: '',
    trim: true,
  },
  catatan_pasien: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'],
    required: true,
  },
  jenis_appointment: {
    type: String,
    enum: ['konsultasi', 'follow_up', 'emergency'],
    default: 'konsultasi',
    required: true,
  },
  reminder_sent: {
    type: Boolean,
    default: false,
  },
  reminder_sent_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  alasan_batal: {
    type: String,
    default: '',
    trim: true,
  },
  rescheduled_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true, // Made required as per user's no-null request for FKs
  },
  rescheduled_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true, // Made required as per user's no-null request for FKs
  },
}, { timestamps: true });

// Indexes
AppointmentSchema.index({ pasien_id: 1 });
AppointmentSchema.index({ doctor_id: 1 });
AppointmentSchema.index({ tanggal_appointment: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ jenis_appointment: 1 });
AppointmentSchema.index({ created_at: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);