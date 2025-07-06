const mongoose = require('mongoose');

const KlinikSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
  },
  no_telepon: {
    type: String,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = mongoose.model('Klinik', KlinikSchema);