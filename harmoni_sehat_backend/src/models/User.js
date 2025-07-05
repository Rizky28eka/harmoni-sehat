const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  phone: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  role: {
    type: String,
    enum: ['pasien', 'doctor', 'apoteker', 'admin'],
    default: 'pasien',
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  password_reset_token: {
    type: String,
    default: '', // Default to empty string instead of null
  },
  password_reset_expires: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  provider: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  provider_id: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  login_attempts: {
    type: Number,
    default: 0,
  },
  locked_until: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  verification_token: {
    type: String,
    default: '', // Default to empty string instead of null
  },
  verification_expires: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes for performance and security
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ is_active: 1 });
UserSchema.index({ is_verified: 1 });
UserSchema.index({ password_reset_token: 1 });
UserSchema.index({ verification_token: 1 });
UserSchema.index({ provider: 1, provider_id: 1 });

module.exports = mongoose.model('User', UserSchema);