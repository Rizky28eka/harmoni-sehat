const { body } = require('express-validator');

const createKlinikValidation = [
  body('nama_klinik').notEmpty().withMessage('Nama klinik is required').isString().withMessage('Nama klinik must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('jam_buka').optional().isTime().withMessage('Invalid jam buka'),
  body('jam_tutup').optional().isTime().withMessage('Invalid jam tutup'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_klinik').optional().isString().withMessage('Foto klinik must be a string'),
  body('is_24_jam').optional().isBoolean().withMessage('Is_24_jam must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
  body('tipe_klinik').optional().isIn(['pratama', 'utama']).withMessage('Invalid tipe klinik'),
];

const updateKlinikValidation = [
  body('nama_klinik').optional().notEmpty().withMessage('Nama klinik is required').isString().withMessage('Nama klinik must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('jam_buka').optional().isTime().withMessage('Invalid jam buka'),
  body('jam_tutup').optional().isTime().withMessage('Invalid jam tutup'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_klinik').optional().isString().withMessage('Foto klinik must be a string'),
  body('is_24_jam').optional().isBoolean().withMessage('Is_24_jam must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
  body('tipe_klinik').optional().isIn(['pratama', 'utama']).withMessage('Invalid tipe klinik'),
];

module.exports = {
  createKlinikValidation,
  updateKlinikValidation,
};
