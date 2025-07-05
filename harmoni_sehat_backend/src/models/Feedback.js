const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  tipe_feedback: {
    type: String,
    enum: ['bug', 'suggestion', 'complaint', 'praise', 'feature_request'],
    required: true,
  },
  judul: {
    type: String,
    default: '',
    trim: true,
  },
  deskripsi: {
    type: String,
    default: '',
    trim: true,
  },
  screenshots: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
  device_info: {
    type: String,
    default: '',
    trim: true,
  },
  app_version: {
    type: String,
    default: '',
    trim: true,
  },
  os_version: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'duplicate'],
    default: 'open',
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true,
  },
  admin_response: {
    type: String,
    default: '',
    trim: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  resolved_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Indexes
FeedbackSchema.index({ user_id: 1 });
FeedbackSchema.index({ tipe_feedback: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ priority: 1 });
FeedbackSchema.index({ assigned_to: 1 });
FeedbackSchema.index({ created_at: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);