const express = require('express');
const router = express.Router();
const rumahSakitController = require('./rumah_sakit.controller');
const { createRumahSakitValidation, updateRumahSakitValidation } = require('./rumah_sakit.validation');

router.get('/', rumahSakitController.getAllRumahSakit);
router.get('/:id', rumahSakitController.getRumahSakitById);
router.post('/', createRumahSakitValidation, rumahSakitController.createRumahSakit);
router.put('/:id', updateRumahSakitValidation, rumahSakitController.updateRumahSakit);
router.delete('/:id', rumahSakitController.deleteRumahSakit);

module.exports = router;
