import { Request, Response, NextFunction } from 'express';
import { analyzeSymptoms } from './gemini.service';
import { AppError } from '../../utils/AppError';
import { ApiResponse } from '../../utils/ApiResponse';

export const analyzeSymptomsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return next(new AppError('Symptoms are required', 400));
    }

    const result = await analyzeSymptoms(symptoms);

    res.status(200).json(new ApiResponse(200, result, 'Symptoms analyzed successfully'));
  } catch (error: any) {
    next(error);
  }
};