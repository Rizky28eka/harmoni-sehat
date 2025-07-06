const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Admin-specific fields can be added here if any
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
