const mongoose = require('mongoose');

const KeranjangObatSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  obat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obat',
    required: true,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true });

module.exports = mongoose.model('KeranjangObat', KeranjangObatSchema);