const express = require('express');
const router = express.Router();
const pengirimanController = require('./pengiriman.controller');
const { createPengirimanValidation, updatePengirimanValidation } = require('./pengiriman.validation');

router.get('/', pengirimanController.getAllPengiriman);
router.get('/:id', pengirimanController.getPengirimanById);
router.post('/', createPengirimanValidation, pengirimanController.createPengiriman);
router.put('/:id', updatePengirimanValidation, pengirimanController.updatePengiriman);
router.delete('/:id', pengirimanController.deletePengiriman);

module.exports = router;
