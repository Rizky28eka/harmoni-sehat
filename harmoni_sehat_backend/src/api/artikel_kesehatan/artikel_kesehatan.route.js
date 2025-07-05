const express = require('express');
const router = express.Router();
const artikelKesehatanController = require('./artikel_kesehatan.controller');
const { createArtikelKesehatanValidation, updateArtikelKesehatanValidation } = require('./artikel_kesehatan.validation');

router.get('/', artikelKesehatanController.getAllArtikelKesehatan);
router.get('/:id', artikelKesehatanController.getArtikelKesehatanById);
router.post('/', createArtikelKesehatanValidation, artikelKesehatanController.createArtikelKesehatan);
router.put('/:id', updateArtikelKesehatanValidation, artikelKesehatanController.updateArtikelKesehatan);
router.delete('/:id', artikelKesehatanController.deleteArtikelKesehatan);

module.exports = router;
