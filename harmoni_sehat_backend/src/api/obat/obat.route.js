const express = require('express');
const router = express.Router();
const obatController = require('./obat.controller');
const { createObatValidation, updateObatValidation } = require('./obat.validation');

router.get('/', obatController.getAllObat);
router.get('/:id', obatController.getObatById);
router.post('/', createObatValidation, obatController.createObat);
router.put('/:id', updateObatValidation, obatController.updateObat);
router.delete('/:id', obatController.deleteObat);

module.exports = router;
