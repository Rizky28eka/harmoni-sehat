const { body } = require('express-validator');

const createResepValidation = [
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('doctor_id').isInt().withMessage('Doctor ID must be an integer'),
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('apotek_id').optional().isInt().withMessage('Apotek ID must be an integer'),
  body('kode_resep').notEmpty().withMessage('Kode resep is required').isString().withMessage('Kode resep must be a string'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
  body('status').isIn(['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('total_harga').optional().isFloat().withMessage('Total harga must be a float'),
  body('biaya_pengiriman').optional().isFloat().withMessage('Biaya pengiriman must be a float'),
];

const updateResepValidation = [
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer'),
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('apotek_id').optional().isInt().withMessage('Apotek ID must be an integer'),
  body('kode_resep').optional().notEmpty().withMessage('Kode resep is required').isString().withMessage('Kode resep must be a string'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
  body('status').optional().isIn(['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('total_harga').optional().isFloat().withMessage('Total harga must be a float'),
  body('biaya_pengiriman').optional().isFloat().withMessage('Biaya pengiriman must be a float'),
];

module.exports = {
  createResepValidation,
  updateResepValidation,
};
