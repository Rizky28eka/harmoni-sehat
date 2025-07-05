const { body } = require('express-validator');

const createAppointmentValidation = [
  body('pasien_id').isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').isInt().withMessage('Doctor ID must be an integer'),
  body('tanggal_appointment').isISO8601().toDate().withMessage('Invalid tanggal appointment'),
  body('jam_appointment').notEmpty().withMessage('Jam appointment is required').isTime().withMessage('Invalid jam appointment'),
  body('keluhan').optional().isString().withMessage('Keluhan must be a string'),
  body('status').isIn(['scheduled', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
  body('reminder_sent').optional().isBoolean().withMessage('Reminder sent must be a boolean'),
];

const updateAppointmentValidation = [
  body('pasien_id').optional().isInt().withMessage('Pasien ID must be an integer'),
  body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer'),
  body('tanggal_appointment').optional().isISO8601().toDate().withMessage('Invalid tanggal appointment'),
  body('jam_appointment').optional().notEmpty().withMessage('Jam appointment is required').isTime().withMessage('Invalid jam appointment'),
  body('keluhan').optional().isString().withMessage('Keluhan must be a string'),
  body('status').optional().isIn(['scheduled', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
  body('reminder_sent').optional().isBoolean().withMessage('Reminder sent must be a boolean'),
];

module.exports = {
  createAppointmentValidation,
  updateAppointmentValidation,
};
