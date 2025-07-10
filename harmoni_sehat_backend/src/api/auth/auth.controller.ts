import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import { createUserInput, loginUserInput } from './auth.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await createUserInput(req.body);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    const { user, token } = await loginUserInput(email, password);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
