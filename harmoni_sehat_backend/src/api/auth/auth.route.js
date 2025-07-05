// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const socialController = require('./social.controller');
const otpController = require('./otp.controller');
const { registerValidationRules, loginValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules } = require('./validation');
const validate = require('../../middleware/validate');

// @route   POST /api/auth/register
// @desc    Registrasi pengguna baru (pasien, dokter, apoteker)
// @access  Public
router.post('/register', registerValidationRules(), validate, authController.register);

// @route   POST /api/auth/login
// @desc    Login pengguna
// @access  Public
router.post('/login', loginValidationRules(), validate, authController.login);

// @route   POST /api/auth/forgot-password
// @desc    Kirim email untuk reset password
// @access  Public
router.post('/forgot-password', forgotPasswordValidationRules(), validate, authController.forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password dengan token
// @access  Public
router.post('/reset-password', resetPasswordValidationRules(), validate, authController.resetPassword);

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
