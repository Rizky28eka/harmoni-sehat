const mongoose = require('mongoose');

const DetailPesananObatSchema = new mongoose.Schema({
  pesanan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PesananObat',
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
  harga_satuan: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('DetailPesananObat', DetailPesananObatSchema);