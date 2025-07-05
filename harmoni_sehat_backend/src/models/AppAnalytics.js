const mongoose = require('mongoose');

const AppAnalyticsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  event_name: {
    type: String,
    required: true,
    trim: true,
  },
  event_category: {
    type: String,
    default: '',
    trim: true,
  },
  event_data: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  platform: {
    type: String,
    default: '',
    trim: true,
  },
  app_version: {
    type: String,
    default: '',
    trim: true,
  },
  device_type: {
    type: String,
    default: '',
    trim: true,
  },
  os_version: {
    type: String,
    default: '',
    trim: true,
  },
  screen_resolution: {
    type: String,
    default: '',
    trim: true,
  },
  session_id: {
    type: String,
    default: '',
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
AppAnalyticsSchema.index({ user_id: 1 });
AppAnalyticsSchema.index({ event_name: 1 });
AppAnalyticsSchema.index({ event_category: 1 });
AppAnalyticsSchema.index({ platform: 1 });
AppAnalyticsSchema.index({ created_at: 1 });

module.exports = mongoose.model('AppAnalytics', AppAnalyticsSchema);