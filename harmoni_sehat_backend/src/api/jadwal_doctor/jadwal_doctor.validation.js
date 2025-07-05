const { body } = require('express-validator');

const createJadwalDoctorValidation = [
  body('doctor_id').isInt().withMessage('Doctor ID must be an integer'),
  body('hari').isIn(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']).withMessage('Invalid hari'),
  body('jam_mulai').notEmpty().withMessage('Jam mulai is required').isTime().withMessage('Invalid jam mulai'),
  body('jam_selesai').notEmpty().withMessage('Jam selesai is required').isTime().withMessage('Invalid jam selesai'),
  body('quota_pasien').optional().isInt().withMessage('Quota pasien must be an integer'),
  body('is_available').optional().isBoolean().withMessage('Is_available must be a boolean'),
];

const updateJadwalDoctorValidation = [
  body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer'),
  body('hari').optional().isIn(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']).withMessage('Invalid hari'),
  body('jam_mulai').optional().notEmpty().withMessage('Jam mulai is required').isTime().withMessage('Invalid jam mulai'),
  body('jam_selesai').optional().notEmpty().withMessage('Jam selesai is required').isTime().withMessage('Invalid jam selesai'),
  body('quota_pasien').optional().isInt().withMessage('Quota pasien must be an integer'),
  body('is_available').optional().isBoolean().withMessage('Is_available must be a boolean'),
];

module.exports = {
  createJadwalDoctorValidation,
  updateJadwalDoctorValidation,
};
