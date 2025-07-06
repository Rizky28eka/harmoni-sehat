const mongoose = require('mongoose');

const ResepObatSchema = new mongoose.Schema({
  resep_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resep',
    required: true,
  },
  obat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obat',
    required: true,
  },
  dosis: {
    type: String,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  aturan_pakai: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('ResepObat', ResepObatSchema);