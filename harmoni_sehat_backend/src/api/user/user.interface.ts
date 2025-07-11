import { Document, Types } from 'mongoose';
import { IRole } from '../../models/Role';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: IRole | string;
  is_active: boolean;
  password_changed_at?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
}

export interface UserResponseDto {
  id: string;
  email: string;
  is_active: boolean;
  role: string | IRole;
}

export const toUserResponseDto = (user: IUser): UserResponseDto => ({
  id: (user._id as Types.ObjectId).toString(),
  email: user.email,
  is_active: user.is_active,
  role: typeof user.role === 'object' ? user.role.nama_peran : user.role,
});
