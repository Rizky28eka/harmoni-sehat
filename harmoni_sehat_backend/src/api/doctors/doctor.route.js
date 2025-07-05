const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { createDoctorValidation, updateDoctorValidation } = require('./doctor.validation');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', createDoctorValidation, doctorController.createDoctor);
router.put('/:id', updateDoctorValidation, doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

// Relational routes
router.get('/:id/jadwal', doctorController.getDoctorJadwal);
router.get('/:id/konsultasi', doctorController.getDoctorKonsultasi);

module.exports = router;
