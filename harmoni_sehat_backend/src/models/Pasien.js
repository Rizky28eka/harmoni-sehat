const mongoose = require('mongoose');

const PasienSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true,
  },
  tanggal_lahir: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  jenis_kelamin: {
    type: String,
    enum: ['L', 'P'],
    default: 'L', // Default to a valid enum value
    required: true,
  },
  alamat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  no_ktp: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  no_bpjs: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  golongan_darah: {
    type: String,
    enum: ['A', 'B', 'AB', 'O'],
    default: '', // Default to empty string instead of null
    trim: true,
  },
  rhesus: {
    type: String,
    enum: ['+', '-'],
    default: '', // Default to empty string instead of null
    trim: true,
  },
  riwayat_alergi: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  riwayat_penyakit: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  kontak_darurat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  nama_kontak_darurat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  hubungan_kontak_darurat: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  foto_profil: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  berat_badan: {
    type: Number,
    default: 0.00,
  },
  tinggi_badan: {
    type: Number,
    default: 0.00,
  },
  provinsi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provinsi',
    required: true, // Made required as per user's no-null request for FKs
  },
  kota_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kota',
    required: true, // Made required as per user's no-null request for FKs
  },
  pekerjaan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  status_pernikahan: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    default: 'single', // Default to a valid enum value
    required: true,
  },
  agama: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
}, { timestamps: true });

// Indexes
PasienSchema.index({ provinsi_id: 1 });
PasienSchema.index({ kota_id: 1 });
PasienSchema.index({ jenis_kelamin: 1 });
PasienSchema.index({ golongan_darah: 1 });

module.exports = mongoose.model('Pasien', PasienSchema);