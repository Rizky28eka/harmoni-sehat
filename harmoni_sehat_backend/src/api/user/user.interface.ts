import { IUser } from '../../models/User';

export interface CreateUserDto {
  email: string;
  password?: string;
}

export interface UpdateUserDto {
  email?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserResponseDto = (user: IUser): UserResponseDto => {
  return {
    id: user._id.toString(),
    email: user.email,
    is_active: user.is_active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
