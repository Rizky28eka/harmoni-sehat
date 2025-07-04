const { body } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Format email tidak valid.'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal harus 6 karakter.'),
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap tidak boleh kosong.'),
    body('no_hp').isMobilePhone('id-ID').withMessage('Format nomor HP tidak valid.'),
    body('role').isIn(['pasien', 'dokter', 'apoteker']).withMessage('Role tidak valid.'),
    // Validasi kondisional
    body('nomor_sip').if(body('role').equals('dokter')).notEmpty().withMessage('Nomor SIP wajib untuk dokter.'),
    body('spesialisasi').if(body('role').equals('dokter')).notEmpty().withMessage('Spesialisasi wajib untuk dokter.'),
    body('nomor_stra').if(body('role').equals('apoteker')).notEmpty().withMessage('Nomor STRA wajib untuk apoteker.'),
    body('alamat_tempat_kerja').if(body('role').equals('apoteker')).notEmpty().withMessage('Alamat tempat kerja wajib untuk apoteker.'),
  ];
};

module.exports = {
  registerValidationRules,
};
