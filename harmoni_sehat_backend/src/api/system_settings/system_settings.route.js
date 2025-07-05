const express = require('express');
const router = express.Router();
const systemSettingsController = require('./system_settings.controller');
const { createSystemSettingsValidation, updateSystemSettingsValidation } = require('./system_settings.validation');

router.get('/', systemSettingsController.getAllSystemSettings);
router.get('/:id', systemSettingsController.getSystemSettingsById);
router.post('/', createSystemSettingsValidation, systemSettingsController.createSystemSettings);
router.put('/:id', updateSystemSettingsValidation, systemSettingsController.updateSystemSettings);
router.delete('/:id', systemSettingsController.deleteSystemSettings);

module.exports = router;
