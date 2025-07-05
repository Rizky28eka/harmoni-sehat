const express = require('express');
const router = express.Router();
const faqController = require('./faq.controller');
const { createFaqValidation, updateFaqValidation } = require('./faq.validation');

router.get('/', faqController.getAllFaq);
router.get('/:id', faqController.getFaqById);
router.post('/', createFaqValidation, faqController.createFaq);
router.put('/:id', updateFaqValidation, faqController.updateFaq);
router.delete('/:id', faqController.deleteFaq);

module.exports = router;
