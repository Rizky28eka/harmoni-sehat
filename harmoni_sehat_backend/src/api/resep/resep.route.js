const express = require('express');
const router = express.Router();
const resepController = require('./resep.controller');
const { createResepValidation, updateResepValidation } = require('./resep.validation');

router.get('/', resepController.getAllResep);
router.get('/:id', resepController.getResepById);
router.post('/', createResepValidation, resepController.createResep);
router.put('/:id', updateResepValidation, resepController.updateResep);
router.delete('/:id', resepController.deleteResep);

// Relational routes
router.get('/:id/detail_resep', resepController.getResepDetailResep);
router.get('/:id/pembayaran', resepController.getResepPembayaran);

module.exports = router;
