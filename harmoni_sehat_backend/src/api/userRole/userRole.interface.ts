import { Types } from 'mongoose';
import { IUserRole } from '../../models/UserRole';

export interface CreateUserRoleDto {
  user_id: string; // Will be ObjectId in service
  role_id: string; // Will be ObjectId in service
}

export interface UpdateUserRoleDto {
  user_id?: string;
  role_id?: string;
}

export interface IUserRoleResponseDto {
  id: string;
  user_id: string;
  role_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserRoleResponseDto = (userRole: IUserRole): IUserRoleResponseDto => {
  return {
    id: userRole._id.toString(),
    user_id: userRole.user_id.toString(),
    role_id: userRole.role_id.toString(),
    createdAt: userRole.createdAt,
    updatedAt: userRole.updatedAt,
  };
};
