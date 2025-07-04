const express = require('express');
const authRoutes = require('./auth/auth.route');
const paymentRoutes = require('./payment/payment.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
