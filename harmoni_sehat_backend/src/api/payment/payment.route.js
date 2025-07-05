const express = require('express');
const router = express.Router();
const pembayaranController = require('./payment.controller');
const { createPembayaranValidation, updatePembayaranValidation } = require('./payment.validation');

router.get('/', pembayaranController.getAllPembayaran);
router.get('/:id', pembayaranController.getPembayaranById);
router.post('/', createPembayaranValidation, pembayaranController.createPembayaran);
router.put('/:id', updatePembayaranValidation, pembayaranController.updatePembayaran);
router.delete('/:id', pembayaranController.deletePembayaran);

module.exports = router;