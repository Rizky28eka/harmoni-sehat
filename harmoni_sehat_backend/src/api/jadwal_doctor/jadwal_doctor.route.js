const express = require('express');
const router = express.Router();
const jadwalDoctorController = require('./jadwal_doctor.controller');
const { createJadwalDoctorValidation, updateJadwalDoctorValidation } = require('./jadwal_doctor.validation');

router.get('/', jadwalDoctorController.getAllJadwalDoctor);
router.get('/:id', jadwalDoctorController.getJadwalDoctorById);
router.post('/', createJadwalDoctorValidation, jadwalDoctorController.createJadwalDoctor);
router.put('/:id', updateJadwalDoctorValidation, jadwalDoctorController.updateJadwalDoctor);
router.delete('/:id', jadwalDoctorController.deleteJadwalDoctor);

module.exports = router;
