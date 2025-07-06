const mongoose = require('mongoose');

const PasienSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
    unique: true,
  },
  tanggal_lahir: {
    type: Date,
  },
  jenis_kelamin: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'],
  },
  alamat: {
    type: String,
  },
  no_telepon: {
    type: String,
  },
});

module.exports = mongoose.model('Pasien', PasienSchema);