const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  customUserId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Made optional for Google OAuth users
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true,
  },
  no_hp: {
    type: String,
    required: false, // Made optional for Google OAuth users
    trim: true,
  },
  no_hp_hash: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have a null value for this field
    select: false, // Do not return this field by default
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
  otpAttempts: {
    type: Number,
    default: 0,
  },
  otpLockUntil: Date,
  refreshTokens: [String], // Array to store multiple refresh tokens
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
