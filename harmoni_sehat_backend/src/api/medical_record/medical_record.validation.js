const { body } = require('express-validator');

const createMedicalRecordValidation = [
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').isInt().withMessage('Doctor ID must be an integer'),
  body('tanggal_rekam').isISO8601().toDate().withMessage('Invalid tanggal rekam'),
  body('anamnesis').optional().isString().withMessage('Anamnesis must be a string'),
  body('pemeriksaan_fisik').optional().isString().withMessage('Pemeriksaan fisik must be a string'),
  body('diagnosa_utama').optional().isString().withMessage('Diagnosa utama must be a string'),
];

const updateMedicalRecordValidation = [
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer'),
  body('tanggal_rekam').optional().isISO8601().toDate().withMessage('Invalid tanggal rekam'),
  body('anamnesis').optional().isString().withMessage('Anamnesis must be a string'),
  body('pemeriksaan_fisik').optional().isString().withMessage('Pemeriksaan fisik must be a string'),
  body('diagnosa_utama').optional().isString().withMessage('Diagnosa utama must be a string'),
];

module.exports = {
  createMedicalRecordValidation,
  updateMedicalRecordValidation,
};
