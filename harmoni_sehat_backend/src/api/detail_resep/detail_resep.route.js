const express = require('express');
const router = express.Router();
const detailResepController = require('./detail_resep.controller');
const { createDetailResepValidation, updateDetailResepValidation } = require('./detail_resep.validation');

router.get('/', detailResepController.getAllDetailResep);
router.get('/:id', detailResepController.getDetailResepById);
router.post('/', createDetailResepValidation, detailResepController.createDetailResep);
router.put('/:id', updateDetailResepValidation, detailResepController.updateDetailResep);
router.delete('/:id', detailResepController.deleteDetailResep);

module.exports = router;
