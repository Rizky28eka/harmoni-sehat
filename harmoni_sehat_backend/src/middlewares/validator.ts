import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import AppError from '../utils/AppError';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(', ');
      return next(new AppError(`Validation error: ${errorMessages}`, 400));
    }
    next(new AppError('Internal Server Error during validation', 500));
  }
};

export default validate;