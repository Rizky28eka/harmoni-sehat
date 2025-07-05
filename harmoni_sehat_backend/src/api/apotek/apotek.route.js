const express = require('express');
const router = express.Router();
const apotekController = require('./apotek.controller');
const { createApotekValidation, updateApotekValidation } = require('./apotek.validation');

router.get('/', apotekController.getAllApotek);
router.get('/:id', apotekController.getApotekById);
router.post('/', createApotekValidation, apotekController.createApotek);
router.put('/:id', updateApotekValidation, apotekController.updateApotek);
router.delete('/:id', apotekController.deleteApotek);

// Relational routes
router.get('/:id/apoteker', apotekController.getApotekApoteker);

module.exports = router;
