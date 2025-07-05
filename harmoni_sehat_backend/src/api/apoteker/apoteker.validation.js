const { body } = require('express-validator');

const createApotekerValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap is required').isString().withMessage('Nama lengkap must be a string'),
  body('no_sipa').notEmpty().withMessage('No SIPA is required').isString().withMessage('No SIPA must be a string'),
  body('apotek_id').optional().isInt().withMessage('Apotek ID must be an integer'),
  body('is_verified').optional().isBoolean().withMessage('Is_verified must be a boolean'),
];

const updateApotekerValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').optional().notEmpty().withMessage('Nama lengkap is required').isString().withMessage('Nama lengkap must be a string'),
  body('no_sipa').optional().notEmpty().withMessage('No SIPA is required').isString().withMessage('No SIPA must be a string'),
  body('apotek_id').optional().isInt().withMessage('Apotek ID must be an integer'),
  body('is_verified').optional().isBoolean().withMessage('Is_verified must be a boolean'),
];

module.exports = {
  createApotekerValidation,
  updateApotekerValidation,
};
