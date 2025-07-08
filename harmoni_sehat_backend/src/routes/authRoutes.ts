import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', ...authController.register);
router.post('/login', ...authController.login);
router.get('/protected', authMiddleware, authController.protectedRoute);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', ...authController.forgotPassword);
router.post('/reset-password', ...authController.resetPassword);
router.post('/verify-account', ...authController.verifyAccount);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/', session: false }), // session: false because we use JWT
    (req: Request, res: Response) => {
        // Successful authentication, generate JWT and redirect
        // req.user is typed by the global Express.User interface
        const token = authController.generateToken(req.user);
        // Redirect to frontend with token in URL hash or query param
        res.redirect(`http://localhost:3000/?token=${token}`);
    }
);

// Placeholder for Apple Login (if needed later)
router.post('/apple', (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: 'Login dengan Apple belum diimplementasikan. Ini memerlukan integrasi Sign in with Apple.' });
});

export default router;