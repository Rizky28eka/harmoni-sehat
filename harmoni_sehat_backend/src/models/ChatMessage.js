const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message_text: {
    type: String,
    default: '',
    trim: true,
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video', 'prescription', 'location'],
    required: true,
  },
  file_path: {
    type: String,
    default: '',
    trim: true,
  },
  file_name: {
    type: String,
    default: '',
    trim: true,
  },
  file_size: {
    type: Number,
    default: 0,
  },
  mime_type: {
    type: String,
    default: '',
    trim: true,
  },
  duration: {
    type: Number,
    default: 0, // for voice/video messages
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  is_edited: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  reply_to_message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
    required: true, // Made required as per user's no-null request for FKs
  },
  metadata: {
    type: Object,
    default: {}, // for storing additional data like location coordinates
  },
  edited_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
  deleted_at: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Indexes
ChatMessageSchema.index({ sender_id: 1 });
ChatMessageSchema.index({ message_type: 1 });
ChatMessageSchema.index({ timestamp: 1 });
ChatMessageSchema.index({ is_read: 1 });
ChatMessageSchema.index({ is_deleted: 1 });
ChatMessageSchema.index({ reply_to_message_id: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);