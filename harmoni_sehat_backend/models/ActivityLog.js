const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aksi: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);