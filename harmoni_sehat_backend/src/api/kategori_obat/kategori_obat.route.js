const express = require('express');
const router = express.Router();
const kategoriObatController = require('./kategori_obat.controller');
const { createKategoriObatValidation, updateKategoriObatValidation } = require('./kategori_obat.validation');

router.get('/', kategoriObatController.getAllKategoriObat);
router.get('/:id', kategoriObatController.getKategoriObatById);
router.post('/', createKategoriObatValidation, kategoriObatController.createKategoriObat);
router.put('/:id', updateKategoriObatValidation, kategoriObatController.updateKategoriObat);
router.delete('/:id', kategoriObatController.deleteKategoriObat);

module.exports = router;
