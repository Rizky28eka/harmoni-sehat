// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// @route   POST /api/auth/register
// @desc    Registrasi pengguna baru (pasien)
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login pengguna
// @access  Public
router.post('/login', authController.login);

module.exports = router;
