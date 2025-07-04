const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.post('/create-transaction', authenticate, authorize('pasien'), paymentController.createTransaction);
router.post('/notification', paymentController.handleNotification);

module.exports = router;
