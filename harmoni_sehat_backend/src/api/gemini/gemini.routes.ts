import express from 'express';
import rateLimit from 'express-rate-limit';
import { analyzeSymptomsController } from './gemini.controller';
import protect from '../../middlewares/protect';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many AI requests, slow down.' },
});

router.use(protect, aiLimiter);
router.post('/analyze-symptoms', analyzeSymptomsController);
router.post('/chat', analyzeSymptomsController);

export default router;
