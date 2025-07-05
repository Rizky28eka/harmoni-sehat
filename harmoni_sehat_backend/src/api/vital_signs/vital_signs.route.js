const express = require('express');
const router = express.Router();
const vitalSignsController = require('./vital_signs.controller');
const { createVitalSignsValidation, updateVitalSignsValidation } = require('./vital_signs.validation');

router.get('/', vitalSignsController.getAllVitalSigns);
router.get('/:id', vitalSignsController.getVitalSignsById);
router.post('/', createVitalSignsValidation, vitalSignsController.createVitalSigns);
router.put('/:id', updateVitalSignsValidation, vitalSignsController.updateVitalSigns);
router.delete('/:id', vitalSignsController.deleteVitalSigns);

module.exports = router;
