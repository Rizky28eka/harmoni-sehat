const { body } = require('express-validator');

const createAdminValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap is required').isString().withMessage('Nama lengkap must be a string'),
  body('level_akses').isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid level akses'),
];

const updateAdminValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').optional().notEmpty().withMessage('Nama lengkap is required').isString().withMessage('Nama lengkap must be a string'),
  body('level_akses').optional().isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid level akses'),
];

module.exports = {
  createAdminValidation,
  updateAdminValidation,
};
