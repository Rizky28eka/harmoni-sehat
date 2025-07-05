const { body } = require('express-validator');

const createApotekValidation = [
  body('nama_apotek').notEmpty().withMessage('Nama apotek is required').isString().withMessage('Nama apotek must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('jam_buka').optional().isTime().withMessage('Invalid jam buka'),
  body('jam_tutup').optional().isTime().withMessage('Invalid jam tutup'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_apotek').optional().isString().withMessage('Foto apotek must be a string'),
  body('is_24_jam').optional().isBoolean().withMessage('Is_24_jam must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
];

const updateApotekValidation = [
  body('nama_apotek').optional().notEmpty().withMessage('Nama apotek is required').isString().withMessage('Nama apotek must be a string'),
  body('alamat').optional().isString().withMessage('Alamat must be a string'),
  body('no_telepon').optional().isString().withMessage('No telepon must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('jam_buka').optional().isTime().withMessage('Invalid jam buka'),
  body('jam_tutup').optional().isTime().withMessage('Invalid jam tutup'),
  body('koordinat_lat').optional().isFloat().withMessage('Koordinat latitude must be a float'),
  body('koordinat_lng').optional().isFloat().withMessage('Koordinat longitude must be a float'),
  body('foto_apotek').optional().isString().withMessage('Foto apotek must be a string'),
  body('is_24_jam').optional().isBoolean().withMessage('Is_24_jam must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a float between 0 and 5'),
];

module.exports = {
  createApotekValidation,
  updateApotekValidation,
};
