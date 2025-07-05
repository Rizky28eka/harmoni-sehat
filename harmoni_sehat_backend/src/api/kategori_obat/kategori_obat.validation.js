const { body } = require('express-validator');

const createKategoriObatValidation = [
  body('nama_kategori').notEmpty().withMessage('Nama kategori is required').isString().withMessage('Nama kategori must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateKategoriObatValidation = [
  body('nama_kategori').optional().notEmpty().withMessage('Nama kategori is required').isString().withMessage('Nama kategori must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createKategoriObatValidation,
  updateKategoriObatValidation,
};
