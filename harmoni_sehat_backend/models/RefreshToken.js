const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expired_at: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);