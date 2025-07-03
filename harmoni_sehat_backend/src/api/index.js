const express = require('express');
const authRoutes = require('./auth/auth.route');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;
