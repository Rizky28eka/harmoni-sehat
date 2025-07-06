const mongoose = require('mongoose');

const ApotekerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nomor_sipa: {
    type: String,
    unique: true,
    sparse: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Apoteker', ApotekerSchema);
