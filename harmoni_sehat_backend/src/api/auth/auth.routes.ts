import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser, loginUser, refresh, logout, me, changePassword,
  forgotPassword, verifyResetToken, resetPassword,
} from './auth.controller';
import { validate } from '../../middlewares/validator';
import protect from '../../middlewares/protect';
import {
  registerSchema, loginSchema, refreshSchema, forgotSchema,
  verifyResetSchema, resetSchema, changePasswordSchema,
} from './auth.validation';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many attempts, please try again later.' },
});

router.use(authLimiter);

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);
router.post('/forgot-password', validate(forgotSchema), forgotPassword);
router.post('/verify-reset-token', validate(verifyResetSchema), verifyResetToken);
router.post('/reset-password', validate(resetSchema), resetPassword);

export default router;
