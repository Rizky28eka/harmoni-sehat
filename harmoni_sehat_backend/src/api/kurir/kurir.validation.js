const { body } = require('express-validator');

const createKurirValidation = [
  body('nama_kurir').notEmpty().withMessage('Nama kurir is required').isString().withMessage('Nama kurir must be a string'),
  body('no_telepon').notEmpty().withMessage('No telepon is required').isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('kendaraan').optional().isIn(['motor', 'mobil', 'sepeda']).withMessage('Invalid kendaraan type'),
  body('nomor_plat').optional().isString().withMessage('Nomor plat must be a string'),
  body('foto_profil').optional().isString().withMessage('Foto profil must be a string'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('area_layanan').optional().isJSON().withMessage('Area layanan must be a JSON string'),
];

const updateKurirValidation = [
  body('nama_kurir').optional().notEmpty().withMessage('Nama kurir is required').isString().withMessage('Nama kurir must be a string'),
  body('no_telepon').optional().notEmpty().withMessage('No telepon is required').isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('kendaraan').optional().isIn(['motor', 'mobil', 'sepeda']).withMessage('Invalid kendaraan type'),
  body('nomor_plat').optional().isString().withMessage('Nomor plat must be a string'),
  body('foto_profil').optional().isString().withMessage('Foto profil must be a string'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('area_layanan').optional().isJSON().withMessage('Area layanan must be a JSON string'),
];

module.exports = {
  createKurirValidation,
  updateKurirValidation,
};
