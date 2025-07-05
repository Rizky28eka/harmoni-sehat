const { body } = require('express-validator');

const createKotaValidation = [
  body('provinsi_id').isInt().withMessage('Provinsi ID must be an integer'),
  body('nama_kota').notEmpty().withMessage('Nama kota is required').isString().withMessage('Nama kota must be a string'),
  body('kode_kota').notEmpty().withMessage('Kode kota is required').isString().withMessage('Kode kota must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateKotaValidation = [
  body('provinsi_id').optional().isInt().withMessage('Provinsi ID must be an integer'),
  body('nama_kota').optional().notEmpty().withMessage('Nama kota is required').isString().withMessage('Nama kota must be a string'),
  body('kode_kota').optional().notEmpty().withMessage('Kode kota is required').isString().withMessage('Kode kota must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createKotaValidation,
  updateKotaValidation,
};
