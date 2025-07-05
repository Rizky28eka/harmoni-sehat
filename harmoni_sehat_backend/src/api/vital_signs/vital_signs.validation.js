const { body } = require('express-validator');

const createVitalSignsValidation = [
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('tanggal_periksa').isISO8601().toDate().withMessage('Invalid tanggal periksa'),
  body('tekanan_darah_sistolik').isInt().withMessage('Tekanan darah sistolik must be an integer'),
  body('tekanan_darah_diastolik').isInt().withMessage('Tekanan darah diastolik must be an integer'),
  body('denyut_nadi').isInt().withMessage('Denyut nadi must be an integer'),
  body('suhu_tubuh').isFloat().withMessage('Suhu tubuh must be a float'),
  body('respiratory_rate').isInt().withMessage('Respiratory rate must be an integer'),
  body('berat_badan').isFloat().withMessage('Berat badan must be a float'),
  body('tinggi_badan').isFloat().withMessage('Tinggi badan must be a float'),
  body('bmi').isFloat().withMessage('BMI must be a float'),
  body('saturasi_oksigen').isFloat().withMessage('Saturasi oksigen must be a float'),
  body('catatan').optional().isString().withMessage('Catatan must be a string'),
];

const updateVitalSignsValidation = [
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('tanggal_periksa').optional().isISO8601().toDate().withMessage('Invalid tanggal periksa'),
  body('tekanan_darah_sistolik').optional().isInt().withMessage('Tekanan darah sistolik must be an integer'),
  body('tekanan_darah_diastolik').optional().isInt().withMessage('Tekanan darah diastolik must be an integer'),
  body('denyut_nadi').optional().isInt().withMessage('Denyut nadi must be an integer'),
  body('suhu_tubuh').optional().isFloat().withMessage('Suhu tubuh must be a float'),
  body('respiratory_rate').optional().isInt().withMessage('Respiratory rate must be an integer'),
  body('berat_badan').optional().isFloat().withMessage('Berat badan must be a float'),
  body('tinggi_badan').optional().isFloat().withMessage('Tinggi badan must be a float'),
  body('bmi').optional().isFloat().withMessage('BMI must be a float'),
  body('saturasi_oksigen').optional().isFloat().withMessage('Saturasi oksigen must be a float'),
  body('catatan').optional().isString().withMessage('Catatan must be a string'),
];

module.exports = {
  createVitalSignsValidation,
  updateVitalSignsValidation,
};
