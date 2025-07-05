const { body } = require('express-validator');

const createPromoValidation = [
  body('kode_promo').notEmpty().withMessage('Kode promo is required').isString().withMessage('Kode promo must be a string'),
  body('nama_promo').notEmpty().withMessage('Nama promo is required').isString().withMessage('Nama promo must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('tipe_diskon').isIn(['percentage', 'fixed_amount', 'free_shipping']).withMessage('Invalid tipe diskon'),
  body('nilai_diskon').isFloat().withMessage('Nilai diskon must be a float'),
  body('minimum_pembelian').optional().isFloat().withMessage('Minimum pembelian must be a float'),
  body('maksimum_diskon').optional().isFloat().withMessage('Maksimum diskon must be a float'),
  body('tanggal_mulai').isISO8601().toDate().withMessage('Invalid tanggal mulai'),
  body('tanggal_berakhir').isISO8601().toDate().withMessage('Invalid tanggal berakhir'),
  body('quota_penggunaan').optional().isInt().withMessage('Quota penggunaan must be an integer'),
  body('sudah_digunakan').optional().isInt().withMessage('Sudah digunakan must be an integer'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('banner_promo').optional().isString().withMessage('Banner promo must be a string'),
];

const updatePromoValidation = [
  body('kode_promo').optional().notEmpty().withMessage('Kode promo is required').isString().withMessage('Kode promo must be a string'),
  body('nama_promo').optional().notEmpty().withMessage('Nama promo is required').isString().withMessage('Nama promo must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('tipe_diskon').optional().isIn(['percentage', 'fixed_amount', 'free_shipping']).withMessage('Invalid tipe diskon'),
  body('nilai_diskon').optional().isFloat().withMessage('Nilai diskon must be a float'),
  body('minimum_pembelian').optional().isFloat().withMessage('Minimum pembelian must be a float'),
  body('maksimum_diskon').optional().isFloat().withMessage('Maksimum diskon must be a float'),
  body('tanggal_mulai').optional().isISO8601().toDate().withMessage('Invalid tanggal mulai'),
  body('tanggal_berakhir').optional().isISO8601().toDate().withMessage('Invalid tanggal berakhir'),
  body('quota_penggunaan').optional().isInt().withMessage('Quota penggunaan must be an integer'),
  body('sudah_digunakan').optional().isInt().withMessage('Sudah digunakan must be an integer'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('banner_promo').optional().isString().withMessage('Banner promo must be a string'),
];

module.exports = {
  createPromoValidation,
  updatePromoValidation,
};
