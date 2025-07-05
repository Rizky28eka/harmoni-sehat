const express = require('express');
const router = express.Router();
const kotaController = require('./kota.controller');
const { createKotaValidation, updateKotaValidation } = require('./kota.validation');

router.get('/', kotaController.getAllKota);
router.get('/:id', kotaController.getKotaById);
router.post('/', createKotaValidation, kotaController.createKota);
router.put('/:id', updateKotaValidation, kotaController.updateKota);
router.delete('/:id', kotaController.deleteKota);

module.exports = router;
