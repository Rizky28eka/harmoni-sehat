const express = require('express');
const router = express.Router();
const pasienController = require('./pasien.controller');
const { createPasienValidation, updatePasienValidation } = require('./pasien.validation');

router.get('/', pasienController.getAllPasien);
router.get('/:id', pasienController.getPasienById);
router.post('/', createPasienValidation, pasienController.createPasien);
router.put('/:id', updatePasienValidation, pasienController.updatePasien);
router.delete('/:id', pasienController.deletePasien);

// Relational routes
router.get('/:id/konsultasi', pasienController.getPasienKonsultasi);

module.exports = router;
