const express = require('express');
const router = express.Router();
const stokObatController = require('./stok_obat.controller');
const { createStokObatValidation, updateStokObatValidation } = require('./stok_obat.validation');

router.get('/', stokObatController.getAllStokObat);
router.get('/:id', stokObatController.getStokObatById);
router.post('/', createStokObatValidation, stokObatController.createStokObat);
router.put('/:id', updateStokObatValidation, stokObatController.updateStokObat);
router.delete('/:id', stokObatController.deleteStokObat);

module.exports = router;
