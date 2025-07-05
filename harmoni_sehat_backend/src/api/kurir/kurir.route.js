const express = require('express');
const router = express.Router();
const kurirController = require('./kurir.controller');
const { createKurirValidation, updateKurirValidation } = require('./kurir.validation');

router.get('/', kurirController.getAllKurir);
router.get('/:id', kurirController.getKurirById);
router.post('/', createKurirValidation, kurirController.createKurir);
router.put('/:id', updateKurirValidation, kurirController.updateKurir);
router.delete('/:id', kurirController.deleteKurir);

module.exports = router;
