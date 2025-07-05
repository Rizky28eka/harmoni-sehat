const mongoose = require('mongoose');

const ApotekerSchema = new mongoose.Schema({
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
  no_sipa: {
    type: String,
    unique: true,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  apotek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apotek',
    required: true, // Made required as per user's no-null request for FKs
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  foto_profil: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  alamat: {
    type: String,
    default: '', // Default to empty string instead of null
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
  },
  pendidikan: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  pengalaman_tahun: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Indexes
ApotekerSchema.index({ apotek_id: 1 });
ApotekerSchema.index({ is_verified: 1 });

module.exports = mongoose.model('Apoteker', ApotekerSchema);