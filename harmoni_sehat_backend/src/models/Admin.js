const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
  level_akses: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    required: true,
  },
  foto_profil: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  departemen: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  permissions: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
}, { timestamps: true });

// Indexes
AdminSchema.index({ level_akses: 1 });
AdminSchema.index({ departemen: 1 });

module.exports = mongoose.model('Admin', AdminSchema);