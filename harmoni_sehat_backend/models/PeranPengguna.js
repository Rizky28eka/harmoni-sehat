const mongoose = require('mongoose');

const PeranPenggunaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  peran_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peran',
    required: true,
  },
});

// Compound index to ensure a user has a role only once
PeranPenggunaSchema.index({ user_id: 1, peran_id: 1 }, { unique: true });

module.exports = mongoose.model('PeranPengguna', PeranPenggunaSchema);
