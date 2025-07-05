const { body } = require('express-validator');

const createProvinsiValidation = [
  body('nama_provinsi').notEmpty().withMessage('Nama provinsi is required').isString().withMessage('Nama provinsi must be a string'),
  body('kode_provinsi').notEmpty().withMessage('Kode provinsi is required').isString().withMessage('Kode provinsi must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateProvinsiValidation = [
  body('nama_provinsi').optional().notEmpty().withMessage('Nama provinsi is required').isString().withMessage('Nama provinsi must be a string'),
  body('kode_provinsi').optional().notEmpty().withMessage('Kode provinsi is required').isString().withMessage('Kode provinsi must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createProvinsiValidation,
  updateProvinsiValidation,
};
