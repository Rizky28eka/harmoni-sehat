const { body } = require('express-validator');

const createPengirimanValidation = [
  body('resep_id').isInt().withMessage('Resep ID must be an integer'),
  body('kurir_id').optional().isInt().withMessage('Kurir ID must be an integer'),
  body('alamat_pengiriman').notEmpty().withMessage('Alamat pengiriman is required').isString().withMessage('Alamat pengiriman must be a string'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('tanggal_kirim').optional().isISO8601().toDate().withMessage('Invalid tanggal kirim'),
  body('estimasi_tiba').optional().isISO8601().toDate().withMessage('Invalid estimasi tiba'),
  body('tanggal_terima').optional().isISO8601().toDate().withMessage('Invalid tanggal terima'),
  body('status_pengiriman').isIn(['pending', 'picked_up', 'on_delivery', 'delivered', 'returned']).withMessage('Invalid status pengiriman'),
  body('catatan_pengiriman').optional().isString().withMessage('Catatan pengiriman must be a string'),
  body('foto_bukti_terima').optional().isString().withMessage('Foto bukti terima must be a string'),
  body('biaya_pengiriman').optional().isFloat().withMessage('Biaya pengiriman must be a float'),
];

const updatePengirimanValidation = [
  body('resep_id').optional().isInt().withMessage('Resep ID must be an integer'),
  body('kurir_id').optional().isInt().withMessage('Kurir ID must be an integer'),
  body('alamat_pengiriman').optional().notEmpty().withMessage('Alamat pengiriman is required').isString().withMessage('Alamat pengiriman must be a string'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('tanggal_kirim').optional().isISO8601().toDate().withMessage('Invalid tanggal kirim'),
  body('estimasi_tiba').optional().isISO8601().toDate().withMessage('Invalid estimasi tiba'),
  body('tanggal_terima').optional().isISO8601().toDate().withMessage('Invalid tanggal terima'),
  body('status_pengiriman').optional().isIn(['pending', 'picked_up', 'on_delivery', 'delivered', 'returned']).withMessage('Invalid status pengiriman'),
  body('catatan_pengiriman').optional().isString().withMessage('Catatan pengiriman must be a string'),
  body('foto_bukti_terima').optional().isString().withMessage('Foto bukti terima must be a string'),
  body('biaya_pengiriman').optional().isFloat().withMessage('Biaya pengiriman must be a float'),
];

module.exports = {
  createPengirimanValidation,
  updatePengirimanValidation,
};
