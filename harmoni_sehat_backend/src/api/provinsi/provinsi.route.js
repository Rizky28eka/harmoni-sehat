const express = require('express');
const router = express.Router();
const provinsiController = require('./provinsi.controller');
const { createProvinsiValidation, updateProvinsiValidation } = require('./provinsi.validation');

router.get('/', provinsiController.getAllProvinsi);
router.get('/:id', provinsiController.getProvinsiById);
router.post('/', createProvinsiValidation, provinsiController.createProvinsi);
router.put('/:id', updateProvinsiValidation, provinsiController.updateProvinsi);
router.delete('/:id', provinsiController.deleteProvinsi);

// Relational routes
router.get('/:id/kota', provinsiController.getProvinsiKota);

module.exports = router;
