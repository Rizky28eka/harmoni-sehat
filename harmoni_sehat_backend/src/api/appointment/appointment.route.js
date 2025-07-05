const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');
const { createAppointmentValidation, updateAppointmentValidation } = require('./appointment.validation');

router.get('/', appointmentController.getAllAppointment);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', createAppointmentValidation, appointmentController.createAppointment);
router.put('/:id', updateAppointmentValidation, appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
