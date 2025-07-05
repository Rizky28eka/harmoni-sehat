const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  table_name: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  record_id: {
    type: Number,
    default: 0, // Default to 0 instead of null
  },
  old_data: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  new_data: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  ip_address: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  user_agent: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'debug'],
    default: 'info',
    required: true,
  },
  module: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  description: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
LogSchema.index({ user_id: 1 });
LogSchema.index({ action: 1 });
LogSchema.index({ table_name: 1 });
LogSchema.index({ level: 1 });
LogSchema.index({ module: 1 });
LogSchema.index({ created_at: 1 });

module.exports = mongoose.model('Log', LogSchema);