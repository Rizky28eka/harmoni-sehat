
const { body } = require('express-validator');

const createSpesialisasiValidation = [
  body('nama_spesialisasi').notEmpty().withMessage('Nama spesialisasi is required').isString().withMessage('Nama spesialisasi must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateSpesialisasiValidation = [
  body('nama_spesialisasi').optional().notEmpty().withMessage('Nama spesialisasi is required').isString().withMessage('Nama spesialisasi must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createSpesialisasiValidation,
  updateSpesialisasiValidation,
};
