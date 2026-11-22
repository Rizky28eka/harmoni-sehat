import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/User';
import { ICreateUserInput } from './auth.interface';
import Role, { IRole } from '../../models/Role';
import Pasien from '../../models/Pasien';
import Dokter from '../../models/Dokter';
import Apoteker from '../../models/Apoteker';
import RefreshToken from '../../models/RefreshToken';
import { AppError } from '../../utils/AppError';
import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_DAYS, FRONTEND_URL } from '../../config/env';
import sendEmail from '../../utils/email';

const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

const sha256 = (v: string) => crypto.createHash('sha256').update(v).digest('hex');

const issueTokens = async (userId: string) => {
  const refreshToken = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({
    user_id: userId,
    token: sha256(refreshToken),
    expired_at: new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
  });
  return { token: signToken(userId), refreshToken };
};

const publicUser = (user: any) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const normalizeRole = (role: string) => (role === 'apoteker' ? 'farmasi' : role);

export const createUserInput = async (input: ICreateUserInput) => {
  const roleName = normalizeRole(input.role);
  // Privileged roles can never be self-registered.
  if (!['pasien', 'dokter', 'farmasi'].includes(roleName)) {
    throw new AppError('Invalid role specified', 400);
  }

  if (await User.findOne({ email: input.email.toLowerCase() })) {
    throw new AppError('Email already exists', 409);
  }

  const role = await Role.findOne({ nama_peran: roleName });
  if (!role) throw new AppError('Invalid role specified', 400);

  const user = await User.create({ email: input.email, password: input.password, role: role._id });

  try {
    switch (roleName) {
      case 'pasien':
        await Pasien.create({
          user_id: user._id,
          nama: input.name,
          nik: input.nik,
          tanggal_lahir: input.tanggal_lahir,
          jenis_kelamin: input.jenis_kelamin,
          alamat: input.alamat,
          no_telepon: input.no_telepon,
        });
        break;
      case 'dokter':
        await Dokter.create({
          user_id: user._id,
          nama: input.name,
          nomor_str: input.nomor_str,
          spesialisasi_id: input.spesialisasi_id,
          biaya_konsultasi: input.biaya_konsultasi ?? 0,
          foto: input.foto,
          bio: input.bio,
          status: 'inactive', // activated once an admin verifies the STR
          is_verified: false,
        });
        break;
      case 'farmasi':
        await Apoteker.create({
          user_id: user._id,
          nama: input.name,
          nomor_sipa: input.nomor_sipa,
          is_verified: false,
        });
        break;
    }
  } catch (err) {
    // No multi-document transactions on standalone Mongo: compensate manually.
    await User.findByIdAndDelete(user._id);
    throw err;
  }

  await user.populate('role');
  const tokens = await issueTokens(String(user._id));
  return { user: publicUser(user), ...tokens };
};

export const loginUserInput = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password')
    .populate('role');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  if (!user.is_active) throw new AppError('This account has been deactivated.', 403);

  const tokens = await issueTokens(String(user._id));
  return { user: publicUser(user), ...tokens };
};

/** Rotating refresh tokens: every use invalidates the presented token. */
export const refreshSession = async (refreshToken: string) => {
  const hashed = sha256(refreshToken);
  const stored = await RefreshToken.findOneAndDelete({ token: hashed });
  if (!stored || stored.expired_at < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
  const user = await User.findById(stored.user_id).populate('role');
  if (!user || !user.is_active) throw new AppError('Account unavailable', 401);

  const tokens = await issueTokens(String(user._id));
  return { user: publicUser(user), ...tokens };
};

export const logoutSession = async (refreshToken?: string, userId?: string, all = false) => {
  if (all && userId) {
    await RefreshToken.deleteMany({ user_id: userId });
  } else if (refreshToken) {
    await RefreshToken.deleteOne({ token: sha256(refreshToken) });
  }
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).populate('role');
  if (!user) throw new AppError('User not found', 404);
  const roleName = (user.role as unknown as IRole).nama_peran;
  let profile: any = null;
  if (roleName === 'pasien') profile = await Pasien.findOne({ user_id: user._id });
  if (roleName === 'dokter') profile = await Dokter.findOne({ user_id: user._id }).populate('spesialisasi_id');
  if (roleName === 'farmasi') profile = await Apoteker.findOne({ user_id: user._id });
  return { user: publicUser(user), profile };
};

export const changePasswordService = async (userId: string, current: string, next: string) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(current))) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = next;
  await user.save();
  await RefreshToken.deleteMany({ user_id: userId });
};

/** Always resolves: never reveals whether the email exists. */
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = sha256(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const message = `<p>Gunakan kode berikut di aplikasi Harmoni Sehat untuk mengatur ulang kata sandi (berlaku 10 menit):</p>
<p><b>${resetToken}</b></p>
<p>Atau buka: ${FRONTEND_URL}/reset-password/${resetToken}</p>
<p>Abaikan email ini jika Anda tidak memintanya.</p>`;

  try {
    await sendEmail({ email: user.email, subject: 'Reset kata sandi Harmoni Sehat', message });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error('Failed to send reset email');
  }
};

export const verifyResetTokenService = async (token: string) => {
  const user = await User.findOne({
    passwordResetToken: sha256(token),
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) throw new AppError('Token is invalid or has expired', 400);
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    passwordResetToken: sha256(token),
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) throw new AppError('Token is invalid or has expired', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await RefreshToken.deleteMany({ user_id: user._id });
};
