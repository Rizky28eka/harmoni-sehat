const { body } = require('express-validator');
const ApiError = require('../../utils/ApiError');
const knex = require('knex')(require('../../../knexfile').development);

const loginValidationRules = () => {
  return [
    body('email').trim().isEmail().withMessage('Format email tidak valid.'),
    body('password').notEmpty().withMessage('Password tidak boleh kosong.'),
    body('role').isIn(['pasien', 'dokter', 'apoteker']).withMessage('Role tidak valid.'),
  ];
};

const registerValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Format email tidak valid.')
      .custom(async (value) => {
        const user = await knex('users').where({ email: value }).first();
        if (user) {
          throw new ApiError(409, 'Email sudah terdaftar.');
        }
      }),
    body('password').isLength({ min: 8 }).withMessage('Password minimal harus 8 karakter.'),
    body('nama_lengkap').trim().notEmpty().withMessage('Nama lengkap tidak boleh kosong.'),
    body('no_hp')
      .trim()
      .isMobilePhone('id-ID')
      .withMessage('Format nomor HP tidak valid.')
      .custom(async (value) => {
        const user = await knex('users').where({ no_hp: value }).first();
        if (user) {
          throw new ApiError(409, 'Nomor HP sudah terdaftar.');
        }
      }),
    body('role').isIn(['pasien', 'dokter', 'apoteker']).withMessage('Role tidak valid.'),
    
    // Validasi kondisional
    body('nomor_sip')
      .if(body('role').equals('dokter'))
      .trim()
      .notEmpty()
      .withMessage('Nomor SIP wajib untuk dokter.'),
    body('spesialisasi')
      .if(body('role').equals('dokter'))
      .trim()
      .notEmpty()
      .withMessage('Spesialisasi wajib untuk dokter.'),
    body('nomor_stra')
      .if(body('role').equals('apoteker'))
      .trim()
      .notEmpty()
      .withMessage('Nomor STRA wajib untuk apoteker.'),
    body('alamat_tempat_kerja')
      .if(body('role').equals('apoteker'))
      .trim()
      .notEmpty()
      .withMessage('Alamat tempat kerja wajib untuk apoteker.'),
  ];
};

const forgotPasswordValidationRules = () => {
  return [
    body('email').trim().isEmail().withMessage('Format email tidak valid.'),
  ];
};

const resetPasswordValidationRules = () => {
  return [
    body('token').notEmpty().withMessage('Token tidak boleh kosong.'),
    body('password').isLength({ min: 8 }).withMessage('Password baru minimal harus 8 karakter.'),
  ];
};


module.exports = {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
};