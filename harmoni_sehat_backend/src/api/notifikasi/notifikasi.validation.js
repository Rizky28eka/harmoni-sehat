const { body } = require('express-validator');

const createNotifikasiValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('judul').notEmpty().withMessage('Judul is required').isString().withMessage('Judul must be a string'),
  body('isi').optional().isString().withMessage('Isi must be a string'),
  body('tipe').isIn(['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo']).withMessage('Invalid tipe notifikasi'),
  body('data_payload').optional().isJSON().withMessage('Data payload must be a JSON string'),
  body('is_read').optional().isBoolean().withMessage('Is_read must be a boolean'),
  body('is_push').optional().isBoolean().withMessage('Is_push must be a boolean'),
];

const updateNotifikasiValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('judul').optional().notEmpty().withMessage('Judul is required').isString().withMessage('Judul must be a string'),
  body('isi').optional().isString().withMessage('Isi must be a string'),
  body('tipe').optional().isIn(['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo']).withMessage('Invalid tipe notifikasi'),
  body('data_payload').optional().isJSON().withMessage('Data payload must be a JSON string'),
  body('is_read').optional().isBoolean().withMessage('Is_read must be a boolean'),
  body('is_push').optional().isBoolean().withMessage('Is_push must be a boolean'),
];

module.exports = {
  createNotifikasiValidation,
  updateNotifikasiValidation,
};
