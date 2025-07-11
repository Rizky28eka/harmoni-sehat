
import { Document, Types } from 'mongoose';

export interface IUserRole extends Document {
  user_id: Types.ObjectId;
  peran_id: Types.ObjectId;
}

export interface IUserRoleResponseDto {
  id: string;
  user_id: string;
  peran_id: string;
}

export const toUserRoleResponseDto = (userRole: IUserRole): IUserRoleResponseDto => ({
  id: (userRole._id as Types.ObjectId).toString(),
  user_id: (userRole.user_id as Types.ObjectId).toString(),
  peran_id: (userRole.peran_id as Types.ObjectId).toString(),
});
