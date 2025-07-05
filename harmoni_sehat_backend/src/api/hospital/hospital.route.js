const express = require('express');
const hospitalController = require('./hospital.controller');

const router = express.Router();

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/doctors', hospitalController.getDoctorsByHospital);

module.exports = router;
