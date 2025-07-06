const mongoose = require('mongoose');

const PesananObatSchema = new mongoose.Schema({
  pasien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pasien',
    required: true,
  },
  kode_pesanan: {
    type: String,
    required: true,
    unique: true,
  },
  total_harga: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  alamat_pengiriman: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PesananObat', PesananObatSchema);