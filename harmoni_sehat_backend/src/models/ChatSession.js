const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true,
    unique: true,
  },
  session_start: {
    type: Date,
    default: Date.now,
  },
  session_end: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  total_messages: {
    type: Number,
    default: 0,
  },
  unread_doctor: {
    type: Number,
    default: 0,
  },
  unread_patient: {
    type: Number,
    default: 0,
  },
  last_message_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  last_message_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
}, { timestamps: true });

// Indexes
ChatSessionSchema.index({ is_active: 1 });
ChatSessionSchema.index({ last_message_at: 1 });
ChatSessionSchema.index({ last_message_by: 1 });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);