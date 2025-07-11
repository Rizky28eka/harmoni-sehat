import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import { createUserInput, loginUserInput, forgotPasswordService, verifyResetTokenService, resetPasswordService } from './auth.service';

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    await verifyResetTokenService(token);
    res.status(200).json({
      status: 'success',
      message: 'Token verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
