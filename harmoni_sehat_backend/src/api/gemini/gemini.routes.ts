import express from 'express';
import { analyzeSymptomsController } from './gemini.controller';

const router = express.Router();

router.post('/analyze-symptoms', analyzeSymptomsController);

export default router;