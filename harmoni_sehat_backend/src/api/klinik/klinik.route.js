const express = require('express');
const router = express.Router();
const klinikController = require('./klinik.controller');
const { createKlinikValidation, updateKlinikValidation } = require('./klinik.validation');

router.get('/', klinikController.getAllKlinik);
router.get('/:id', klinikController.getKlinikById);
router.post('/', createKlinikValidation, klinikController.createKlinik);
router.put('/:id', updateKlinikValidation, klinikController.updateKlinik);
router.delete('/:id', klinikController.deleteKlinik);

module.exports = router;
