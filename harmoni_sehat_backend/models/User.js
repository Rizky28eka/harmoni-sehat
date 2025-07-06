const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true,
  },
  no_hp: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Pasien', 'Dokter', 'Apoteker', 'Admin'], // Define allowed roles
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetOtp: String,
  resetOtpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
