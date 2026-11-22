import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { chatWithAssistant } from './gemini.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(3000) })).max(20).optional(),
});

export const analyzeSymptomsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.safeParse({ message: req.body?.symptoms ?? req.body?.message, history: req.body?.history });
    if (!parsed.success) return next(new AppError('Pesan/gejala wajib diisi (maks 1000 karakter)', 400));
    const result = await chatWithAssistant(parsed.data.message, parsed.data.history);
    res.status(200).json(new ApiResponse(200, result, 'OK'));
  } catch (error) {
    next(error);
  }
};
