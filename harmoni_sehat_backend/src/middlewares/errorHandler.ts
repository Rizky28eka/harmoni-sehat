import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { NODE_ENV } from '../config/env';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ status: 'error', message: err.message });
  }

  // Mongoose validation
  if (err?.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((e: any) => e.message)
      .join(', ');
    return res.status(400).json({ status: 'error', message });
  }
  // Mongoose bad ObjectId
  if (err?.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: `Invalid ${err.path}: ${err.value}` });
  }
  // Duplicate key
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ status: 'error', message: `Duplicate value for ${field}` });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON body' });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'production' ? 'Something went wrong!' : err?.message || 'Something went wrong!',
  });
};

export default errorHandler;
