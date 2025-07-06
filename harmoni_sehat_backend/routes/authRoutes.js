const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import passport
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', ...authController.register);
router.post('/login', ...authController.login);
router.get('/protected', authMiddleware, authController.protectedRoute);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);
router.post('/forgot-password', ...authController.forgotPassword);
router.post('/reset-password', ...authController.resetPassword);
router.post('/verify-account', ...authController.verifyAccount);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/', session: false }), // session: false because we use JWT
    (req, res) => {
        // Successful authentication, generate JWT and redirect
        const token = authController.generateToken(req.user);
        // Redirect to frontend with token in URL hash or query param
        res.redirect(`http://localhost:3000/?token=${token}`);
    }
);

// Placeholder for Apple Login (if needed later)
router.post('/apple', (req, res) => {
    res.status(501).json({ success: false, message: 'Login dengan Apple belum diimplementasikan. Ini memerlukan integrasi Sign in with Apple.' });
});

module.exports = router;
