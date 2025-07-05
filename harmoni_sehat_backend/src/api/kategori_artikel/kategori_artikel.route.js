const express = require('express');
const router = express.Router();
const kategoriArtikelController = require('./kategori_artikel.controller');
const { createKategoriArtikelValidation, updateKategoriArtikelValidation } = require('./kategori_artikel.validation');

router.get('/', kategoriArtikelController.getAllKategoriArtikel);
router.get('/:id', kategoriArtikelController.getKategoriArtikelById);
router.post('/', createKategoriArtikelValidation, kategoriArtikelController.createKategoriArtikel);
router.put('/:id', updateKategoriArtikelValidation, kategoriArtikelController.updateKategoriArtikel);
router.delete('/:id', kategoriArtikelController.deleteKategoriArtikel);

module.exports = router;
