const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  setting_key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  setting_value: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  setting_type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'text'],
    required: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
  description: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  is_public: {
    type: Boolean,
    default: false,
  },
  is_editable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes
SystemSettingsSchema.index({ category: 1 });
SystemSettingsSchema.index({ is_public: 1 });
SystemSettingsSchema.index({ is_editable: 1 });

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);