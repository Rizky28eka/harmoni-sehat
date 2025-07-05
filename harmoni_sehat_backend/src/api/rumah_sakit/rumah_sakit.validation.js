const { body } = require('express-validator');

const createRumahSakitValidation = [
  body('nama_rumah_sakit').notEmpty().withMessage('Nama rumah sakit is required').isString().withMessage('Nama rumah sakit must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('website').optional().isString().withMessage('Website must be a string'),
  body('tipe_rumah_sakit').optional().isIn(['pemerintah', 'swasta', 'militer']).withMessage('Invalid tipe rumah sakit'),
  body('kelas_rumah_sakit').optional().isIn(['A', 'B', 'C', 'D']).withMessage('Invalid kelas rumah sakit'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_rumah_sakit').optional().isString().withMessage('Foto rumah sakit must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateRumahSakitValidation = [
  body('nama_rumah_sakit').optional().notEmpty().withMessage('Nama rumah sakit is required').isString().withMessage('Nama rumah sakit must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('website').optional().isString().withMessage('Website must be a string'),
  body('tipe_rumah_sakit').optional().isIn(['pemerintah', 'swasta', 'militer']).withMessage('Invalid tipe rumah sakit'),
  body('kelas_rumah_sakit').optional().isIn(['A', 'B', 'C', 'D']).withMessage('Invalid kelas rumah sakit'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_rumah_sakit').optional().isString().withMessage('Foto rumah sakit must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createRumahSakitValidation,
  updateRumahSakitValidation,
};
