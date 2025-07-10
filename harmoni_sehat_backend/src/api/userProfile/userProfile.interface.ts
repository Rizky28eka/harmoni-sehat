import { Types } from 'mongoose';
import { IUserProfile } from '../../models/UserProfile';

export interface CreateUserProfileDto {
  user_id: string; // Will be ObjectId in service
  foto?: string;
  bio?: string;
}

export interface UpdateUserProfileDto {
  foto?: string;
  bio?: string;
}

export interface IUserProfileResponseDto {
  id: string;
  user_id: string;
  foto?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserProfileResponseDto = (userProfile: any): IUserProfileResponseDto => {
  return {
    id: userProfile._id.toString(),
    user_id: userProfile.user_id.toString(),
    foto: userProfile.foto,
    bio: userProfile.bio,
    createdAt: userProfile.createdAt,
    updatedAt: userProfile.updatedAt,
  };
};
