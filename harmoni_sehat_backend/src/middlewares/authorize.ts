import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/** Allow only the given role names (e.g. 'admin', 'dokter'). Must run after `protect`. */
const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).userRole as string | undefined;
    if (!role || (role !== 'superadmin' && !roles.includes(role))) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export default authorize;
