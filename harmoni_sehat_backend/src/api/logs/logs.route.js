const express = require('express');
const router = express.Router();
const logsController = require('./logs.controller');
const { createLogsValidation, updateLogsValidation } = require('./logs.validation');

router.get('/', logsController.getAllLogs);
router.get('/:id', logsController.getLogsById);
router.post('/', createLogsValidation, logsController.createLogs);
router.put('/:id', updateLogsValidation, logsController.updateLogs);
router.delete('/:id', logsController.deleteLogs);

module.exports = router;
