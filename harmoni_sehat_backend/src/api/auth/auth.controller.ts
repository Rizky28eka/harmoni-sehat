import { Request, Response, NextFunction } from 'express';
import {
  createUserInput,
  loginUserInput,
  refreshSession,
  logoutSession,
  getProfile,
  changePasswordService,
  forgotPasswordService,
  verifyResetTokenService,
  resetPasswordService,
} from './auth.service';

const wrap =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (e) {
      next(e);
    }
  };

export const registerUser = wrap(async (req, res) => {
  const { user, token, refreshToken } = await createUserInput(req.body);
  res.status(201).json({ status: 'success', token, refreshToken, data: { user } });
});

export const loginUser = wrap(async (req, res) => {
  const { user, token, refreshToken } = await loginUserInput(req.body.email, req.body.password);
  res.status(200).json({ status: 'success', token, refreshToken, data: { user } });
});

export const refresh = wrap(async (req, res) => {
  const { user, token, refreshToken } = await refreshSession(req.body.refreshToken);
  res.status(200).json({ status: 'success', token, refreshToken, data: { user } });
});

export const logout = wrap(async (req, res) => {
  await logoutSession(req.body?.refreshToken, String((req as any).user._id), req.body?.all === true);
  res.status(200).json({ status: 'success', message: 'Logged out' });
});

export const me = wrap(async (req, res) => {
  const data = await getProfile(String((req as any).user._id));
  res.status(200).json({ status: 'success', data });
});

export const changePassword = wrap(async (req, res) => {
  await changePasswordService(String((req as any).user._id), req.body.currentPassword, req.body.newPassword);
  res.status(200).json({ status: 'success', message: 'Password changed' });
});

export const forgotPassword = wrap(async (req, res) => {
  await forgotPasswordService(req.body.email);
  res.status(200).json({
    status: 'success',
    message: 'If that email is registered, a reset code has been sent.',
  });
});

export const verifyResetToken = wrap(async (req, res) => {
  await verifyResetTokenService(req.body.token);
  res.status(200).json({ status: 'success', message: 'Token verified successfully' });
});

export const resetPassword = wrap(async (req, res) => {
  await resetPasswordService(req.body.token, req.body.newPassword);
  res.status(200).json({ status: 'success', message: 'Password reset successfully' });
});
