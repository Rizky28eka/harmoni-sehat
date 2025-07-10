import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    const errors = error.errors.map((err: any) => err.message);
    next(new AppError(errors.join(', '), 400));
  }
};
