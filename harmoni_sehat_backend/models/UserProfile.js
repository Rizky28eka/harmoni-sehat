const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
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
  nomor_telepon: {
    type: String,
  },
  foto: {
    type: String, // URL to the photo
  },
  bio: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
