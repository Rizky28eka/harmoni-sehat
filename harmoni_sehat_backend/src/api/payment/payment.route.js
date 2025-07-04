const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

router.post('/create-transaction', paymentController.createTransaction);
router.post('/notification', paymentController.handleNotification);

module.exports = router;
