import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import { IRole } from '../models/Role';
import actorContext from './actorContext';

interface JwtPayload {
  id: string;
  iat?: number;
}

export const extractToken = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  return undefined;
};

export const verifyAccessToken = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  const user = await User.findById(decoded.id).populate('role');
  if (!user) {
    throw new AppError('The user belonging to this token does no longer exist.', 401);
  }
  if (!user.is_active) {
    throw new AppError('This account has been deactivated.', 403);
  }
  const roleName = (user.role as unknown as IRole)?.nama_peran;
  return { user, roleName };
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const { user, roleName } = await verifyAccessToken(token);
    (req as any).user = user;
    (req as any).userRole = roleName;
    return actorContext(req, res, next);
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export default protect;
