import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import env from '../config/env';
import User, { IUser } from '../models/User';
import UserRole from '../models/UserRole';
import Role from '../models/Role';

// Extend Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // Get user roles
    const userRoles = await UserRole.find({ user_id: currentUser._id }).populate('role_id');
    currentUser.roles = userRoles.map(ur => (ur.role_id as any).nama_peran);

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};
