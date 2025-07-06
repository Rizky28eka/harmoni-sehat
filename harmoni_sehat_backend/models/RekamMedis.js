const mongoose = require('mongoose');

const RekamMedisSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
    unique: true,
  },
  riwayat_penyakit: {
    type: [String],
  },
  alergi: {
    type: [String],
  },
  riwayat_vaksinasi: {
    type: [String],
  },
});

module.exports = mongoose.model('RekamMedis', RekamMedisSchema);