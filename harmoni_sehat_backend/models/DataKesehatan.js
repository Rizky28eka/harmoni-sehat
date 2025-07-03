// models/DataKesehatan.js
const mongoose = require('mongoose');

const DataKesehatanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  detakJantung: {
    type: Number,
    required: true,
  },
  suhuTubuh: {
    type: Number,
    required: true,
  },
  tanggal: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DataKesehatan', DataKesehatanSchema);