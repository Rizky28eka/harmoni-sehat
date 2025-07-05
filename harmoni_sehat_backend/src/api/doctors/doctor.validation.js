const { body } = require('express-validator');

const createDoctorValidation = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap is required'),
  body('no_sip').notEmpty().withMessage('No SIP is required'),
  body('spesialisasi_id').isInt().withMessage('Spesialisasi ID must be an integer'),
  body('pengalaman_tahun').isInt().withMessage('Pengalaman tahun must be an integer'),
  body('tarif_konsultasi').isFloat().withMessage('Tarif konsultasi must be a float'),
  body('rumah_sakit_id').isInt().withMessage('Rumah sakit ID must be an integer'),
];

const updateDoctorValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('nama_lengkap').optional().notEmpty().withMessage('Nama lengkap is required'),
  body('no_sip').optional().notEmpty().withMessage('No SIP is required'),
  body('spesialisasi_id').optional().isInt().withMessage('Spesialisasi ID must be an integer'),
  body('pengalaman_tahun').optional().isInt().withMessage('Pengalaman tahun must be an integer'),
  body('tarif_konsultasi').optional().isFloat().withMessage('Tarif konsultasi must be a float'),
  body('rumah_sakit_id').optional().isInt().withMessage('Rumah sakit ID must be an integer'),
];

module.exports = {
  createDoctorValidation,
  updateDoctorValidation,
};
