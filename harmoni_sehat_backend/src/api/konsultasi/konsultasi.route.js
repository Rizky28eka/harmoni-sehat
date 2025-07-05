const express = require('express');
const router = express.Router();
const konsultasiController = require('./konsultasi.controller');
const { createKonsultasiValidation, updateKonsultasiValidation } = require('./konsultasi.validation');

router.get('/', konsultasiController.getAllKonsultasi);
router.get('/:id', konsultasiController.getKonsultasiById);
router.post('/', createKonsultasiValidation, konsultasiController.createKonsultasi);
router.put('/:id', updateKonsultasiValidation, konsultasiController.updateKonsultasi);
router.delete('/:id', konsultasiController.deleteKonsultasi);

// Relational routes
router.get('/:id/resep', konsultasiController.getKonsultasiResep);
router.get('/:id/pembayaran', konsultasiController.getKonsultasiPembayaran);

module.exports = router;
