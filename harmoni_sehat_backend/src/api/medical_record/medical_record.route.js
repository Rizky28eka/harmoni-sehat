const express = require('express');
const router = express.Router();
const medicalRecordController = require('./medical_record.controller');
const { createMedicalRecordValidation, updateMedicalRecordValidation } = require('./medical_record.validation');

router.get('/', medicalRecordController.getAllMedicalRecord);
router.get('/:id', medicalRecordController.getMedicalRecordById);
router.post('/', createMedicalRecordValidation, medicalRecordController.createMedicalRecord);
router.put('/:id', updateMedicalRecordValidation, medicalRecordController.updateMedicalRecord);
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

module.exports = router;
