// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const socialController = require('./social.controller');
const otpController = require('./otp.controller');

// @route   POST /api/auth/register
// @desc    Registrasi pengguna baru (pasien)
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login pengguna
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/google/login
// @desc    Login dengan Google
// @access  Public
router.post('/google/login', socialController.googleLogin);

// @route   POST /api/auth/apple/login
// @desc    Login dengan Apple
// @access  Public
router.post('/apple/login', socialController.appleLogin);

// @route   POST /api/auth/otp/send
// @desc    Kirim OTP ke nomor telepon
// @access  Public
router.post('/otp/send', otpController.sendOtp);

// @route   POST /api/auth/otp/verify
// @desc    Verifikasi OTP dan login
// @access  Public
router.post('/otp/verify', otpController.verifyOtp);

module.exports = router;
