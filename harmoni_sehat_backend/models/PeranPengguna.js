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

module.exports = mongoose.model('PeranPengguna', PeranPenggunaSchema);