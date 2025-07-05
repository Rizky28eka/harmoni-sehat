const { body } = require('express-validator');

const createPembayaranValidation = [
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('kode_pembayaran').notEmpty().withMessage('Kode pembayaran is required').isString().withMessage('Kode pembayaran must be a string'),
  body('jenis_pembayaran').isIn(['konsultasi', 'obat', 'keduanya']).withMessage('Invalid jenis pembayaran'),
  body('jumlah_bayar').isFloat().withMessage('Jumlah bayar must be a float'),
  body('total_bayar').isFloat().withMessage('Total bayar must be a float'),
  body('metode_pembayaran').isIn(['transfer', 'ewallet', 'va', 'kartu_kredit', 'cod']).withMessage('Invalid metode pembayaran'),
  body('status_pembayaran').isIn(['pending', 'success', 'failed', 'refunded', 'expired']).withMessage('Invalid status pembayaran'),
  body('tanggal_pembayaran').optional().isISO8601().toDate().withMessage('Invalid tanggal pembayaran'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
];

const updatePembayaranValidation = [
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('kode_pembayaran').optional().notEmpty().withMessage('Kode pembayaran is required').isString().withMessage('Kode pembayaran must be a string'),
  body('jenis_pembayaran').optional().isIn(['konsultasi', 'obat', 'keduanya']).withMessage('Invalid jenis pembayaran'),
  body('jumlah_bayar').optional().isFloat().withMessage('Jumlah bayar must be a float'),
  body('total_bayar').optional().isFloat().withMessage('Total bayar must be a float'),
  body('metode_pembayaran').optional().isIn(['transfer', 'ewallet', 'va', 'kartu_kredit', 'cod']).withMessage('Invalid metode pembayaran'),
  body('status_pembayaran').optional().isIn(['pending', 'success', 'failed', 'refunded', 'expired']).withMessage('Invalid status pembayaran'),
  body('tanggal_pembayaran').optional().isISO8601().toDate().withMessage('Invalid tanggal pembayaran'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
];

module.exports = {
  createPembayaranValidation,
  updatePembayaranValidation,
};
