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
  updatedAt: Date;
}

export const toUserProfileResponseDto = (userProfile: IUserProfile): IUserProfileResponseDto => {
  return {
    id: userProfile._id.toString(),
    user_id: userProfile.user_id.toString(),
    foto: userProfile.foto,
    bio: userProfile.bio,
    updatedAt: userProfile.updatedAt,
  };
};
