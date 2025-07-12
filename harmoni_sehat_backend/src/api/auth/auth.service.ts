import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../../models/User';
import { ICreateUserInput } from './auth.interface';
import Role, { IRole } from '../../models/Role'; // Import Role model
import Pasien from '../../models/Pasien';
import Dokter from '../../models/Dokter';
import Apoteker from '../../models/Apoteker';
import Admin from '../../models/Admin';
import { AppError } from '../../utils/AppError';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/env';
import crypto from 'crypto';

import sendEmail from '../../utils/email';

const signToken = (id: string) => {
  const jwtOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };
  return jwt.sign({ id }, JWT_SECRET, jwtOptions);
};

export const createUserInput = async (input: ICreateUserInput) => {
  const userExists = await User.findOne({ email: input.email });
  if (userExists) {
    throw new AppError('Email already exists', 409);
  }

  // Find the role by name
  const role = await Role.findOne({ nama_peran: input.role });
  if (!role) {
    throw new AppError('Invalid role specified', 400);
  }

  const user = await User.create({
    email: input.email,
    password: input.password,
    role: role._id, // Use the ObjectId of the role
  });
  await user.populate('role'); // Populate the role field

  // Create role-specific entry
  if (user.role) {
    const roleName = (user.role as unknown as IRole).nama_peran;
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
          biaya_konsultasi: input.biaya_konsultasi,
          foto: input.foto,
          bio: input.bio,
        });
        break;
      case 'farmasi':
        await Apoteker.create({
          user_id: user._id,
          nama: input.name,
          nomor_sipa: input.nomor_sipa,
        });
        break;
      case 'admin':
        await Admin.create({
          user_id: user._id,
          nama: input.name,
        });
        break;
      default:
        // Handle unknown role or no specific data needed
        break;
    }
  }

  // Remove password from output
  const userObject = user.toObject();
  delete userObject.password;

  const token = signToken((user._id as Types.ObjectId).toString());
  return { user: userObject, token };
};

export const loginUserInput = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password').populate('role'); // Populate the role field

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  // Remove password from output
  const userObject = user.toObject();
  delete userObject.password;

  const token = signToken((user._id as Types.ObjectId).toString());
  return { user: userObject, token };
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('There is no user with that email address.', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    console.log('Password Reset Token sent to email!');
  } catch (err: any) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

export const verifyResetTokenService = async (token: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
};
