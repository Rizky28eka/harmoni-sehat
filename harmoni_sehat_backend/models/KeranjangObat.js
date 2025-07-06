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

KeranjangObatSchema.index({ pasien_id: 1, obat_id: 1 }, { unique: true });

module.exports = mongoose.model('KeranjangObat', KeranjangObatSchema);
