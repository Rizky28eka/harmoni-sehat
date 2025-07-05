const { body } = require('express-validator');

const createKonsultasiValidation = [
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').isInt().withMessage('Doctor ID must be an integer'),
  body('keluhan_utama').notEmpty().withMessage('Keluhan utama is required').isString().withMessage('Keluhan utama must be a string'),
  body('tanggal_konsultasi').isISO8601().toDate().withMessage('Invalid tanggal konsultasi'),
  body('status').isIn(['pending', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('jenis_konsultasi').isIn(['chat', 'video_call', 'voice_call']).withMessage('Invalid jenis konsultasi'),
];

const updateKonsultasiValidation = [
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer'),
  body('keluhan_utama').optional().notEmpty().withMessage('Keluhan utama is required').isString().withMessage('Keluhan utama must be a string'),
  body('tanggal_konsultasi').optional().isISO8601().toDate().withMessage('Invalid tanggal konsultasi'),
  body('status').optional().isIn(['pending', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('jenis_konsultasi').optional().isIn(['chat', 'video_call', 'voice_call']).withMessage('Invalid jenis konsultasi'),
];

module.exports = {
  createKonsultasiValidation,
  updateKonsultasiValidation,
};
