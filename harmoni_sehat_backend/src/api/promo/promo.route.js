const express = require('express');
const router = express.Router();
const promoController = require('./promo.controller');
const { createPromoValidation, updatePromoValidation } = require('./promo.validation');

router.get('/', promoController.getAllPromo);
router.get('/:id', promoController.getPromoById);
router.post('/', createPromoValidation, promoController.createPromo);
router.put('/:id', updatePromoValidation, promoController.updatePromo);
router.delete('/:id', promoController.deletePromo);

module.exports = router;
