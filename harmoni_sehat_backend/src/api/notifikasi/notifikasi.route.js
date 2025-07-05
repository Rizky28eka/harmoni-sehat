const express = require('express');
const router = express.Router();
const notifikasiController = require('./notifikasi.controller');
const { createNotifikasiValidation, updateNotifikasiValidation } = require('./notifikasi.validation');

router.get('/', notifikasiController.getAllNotifikasi);
router.get('/:id', notifikasiController.getNotifikasiById);
router.post('/', createNotifikasiValidation, notifikasiController.createNotifikasi);
router.put('/:id', updateNotifikasiValidation, notifikasiController.updateNotifikasi);
router.delete('/:id', notifikasiController.deleteNotifikasi);

module.exports = router;
