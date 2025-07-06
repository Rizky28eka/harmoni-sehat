const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true,
  },
  pengirim_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isi: {
    type: String,
    required: true,
  },
  tipe: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
  file_url: {
    type: String,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
