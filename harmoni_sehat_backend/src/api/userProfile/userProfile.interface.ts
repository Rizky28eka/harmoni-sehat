
import { Types } from 'mongoose';
import { IUserProfile } from '../../models/UserProfile';

export interface CreateUserProfileDto {
  user_id: Types.ObjectId; // Will be ObjectId in service
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
}

export const toUserProfileResponseDto = (userProfile: IUserProfile): IUserProfileResponseDto => ({
  id: (userProfile._id as Types.ObjectId).toString(),
  user_id: (userProfile.user_id as Types.ObjectId).toString(),
  foto: userProfile.foto,
  bio: userProfile.bio,
});
