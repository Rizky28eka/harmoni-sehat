const mongoose = require('mongoose');

const PasienSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nik: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
}, { timestamps: true });

module.exports = mongoose.model('Pasien', PasienSchema);
