
const express = require('express');
const router = express.Router();
const spesialisasiController = require('./spesialisasi.controller');
const { createSpesialisasiValidation, updateSpesialisasiValidation } = require('./spesialisasi.validation');

router.get('/', spesialisasiController.getAllSpesialisasi);
router.get('/:id', spesialisasiController.getSpesialisasiById);
router.post('/', createSpesialisasiValidation, spesialisasiController.createSpesialisasi);
router.put('/:id', updateSpesialisasiValidation, spesialisasiController.updateSpesialisasi);
router.delete('/:id', spesialisasiController.deleteSpesialisasi);

module.exports = router;
