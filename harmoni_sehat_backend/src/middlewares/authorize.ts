import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return next(new AppError('You are not authorized to access this route.', 403));
    }

    const hasPermission = roles.some(role => req.user!.roles!.includes(role));

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};
