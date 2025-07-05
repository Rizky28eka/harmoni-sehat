const { body } = require('express-validator');

const createPasienValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap is required'),
  body('tanggal_lahir').isDate().withMessage('Invalid tanggal lahir'),
  body('jenis_kelamin').isIn(['L', 'P']).withMessage('Invalid jenis kelamin'),
  body('no_ktp').isLength({ min: 16, max: 16 }).withMessage('No KTP must be 16 characters'),
];

const updatePasienValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').optional().notEmpty().withMessage('Nama lengkap is required'),
  body('tanggal_lahir').optional().isDate().withMessage('Invalid tanggal lahir'),
  body('jenis_kelamin').optional().isIn(['L', 'P']).withMessage('Invalid jenis kelamin'),
  body('no_ktp').optional().isLength({ min: 16, max: 16 }).withMessage('No KTP must be 16 characters'),
];

module.exports = {
  createPasienValidation,
  updatePasienValidation,
};
