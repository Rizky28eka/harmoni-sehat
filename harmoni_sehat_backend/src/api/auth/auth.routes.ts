import { Router } from 'express';
import { registerUser, loginUser, forgotPassword, verifyResetToken, resetPassword } from './auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

export default router;
