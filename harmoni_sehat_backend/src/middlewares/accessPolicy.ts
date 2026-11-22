import { Request, Response, NextFunction, RequestHandler } from 'express';
import protect from './protect';
import { AppError } from '../utils/AppError';

type Roles = string[] | 'any' | 'public';

const READ = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Router-level RBAC. `read` applies to GET/HEAD, `write` to everything else.
 *  - 'public': no authentication needed (read only)
 *  - 'any': any authenticated user
 *  - string[]: only these roles (admin and superadmin are always allowed)
 */
export const accessPolicy = (read: Roles, write: Roles): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rule = READ.has(req.method) ? read : write;
    if (rule === 'public' && READ.has(req.method)) return next();

    protect(req, res, (err?: any) => {
      if (err) return next(err);
      if (rule === 'any' || rule === 'public') return next();
      const role = (req as any).userRole as string;
      if (role === 'admin' || role === 'superadmin' || rule.includes(role)) return next();
      next(new AppError('You do not have permission to perform this action', 403));
    });
  };
};
