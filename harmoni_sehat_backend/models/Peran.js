const mongoose = require('mongoose');

const PeranSchema = new mongoose.Schema({
  nama_peran: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Peran', PeranSchema);