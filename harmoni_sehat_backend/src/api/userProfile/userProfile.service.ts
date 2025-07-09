import UserProfile, { IUserProfile } from '../../models/UserProfile';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateUserProfileInput, UpdateUserProfileInput } from './userProfile.validation';
import User from '../../models/User';

class UserProfileService {
  async createUserProfile(userId: string, userProfileData: CreateUserProfileInput): Promise<IUserProfile> {
    // Check if a user profile already exists for this user
    const existingProfile = await UserProfile.findOne({ user_id: userId });
    if (existingProfile) {
      throw new AppError('User profile already exists for this user', 409);
    }

    // Check if the user exists and is active
    const user = await User.findById(userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or not active', 404);
    }

    const newUserProfile = await UserProfile.create({ ...userProfileData, user_id: userId });
    return newUserProfile;
  }

  async getAllUserProfiles(): Promise<IUserProfile[]> {
    return UserProfile.find().populate('user_id');
  }

  async getUserProfileById(userProfileId: string): Promise<IUserProfile | null> {
    if (!Types.ObjectId.isValid(userProfileId)) {
      throw new AppError('Invalid User Profile ID', 400);
    }
    const userProfile = await UserProfile.findById(userProfileId).populate('user_id');
    if (!userProfile) {
      throw new AppError('User Profile not found', 404);
    }
    return userProfile;
  }

  async getMyUserProfile(userId: string): Promise<IUserProfile | null> {
    const userProfile = await UserProfile.findOne({ user_id: userId }).populate('user_id');
    if (!userProfile) {
      throw new AppError('User Profile not found for this user', 404);
    }
    return userProfile;
  }

  async updateUserProfile(userProfileId: string, userProfileData: UpdateUserProfileInput): Promise<IUserProfile | null> {
    if (!Types.ObjectId.isValid(userProfileId)) {
      throw new AppError('Invalid User Profile ID', 400);
    }
    const userProfile = await UserProfile.findByIdAndUpdate(userProfileId, userProfileData, { new: true, runValidators: true });
    if (!userProfile) {
      throw new AppError('User Profile not found', 404);
    }
    return userProfile;
  }

  async deleteUserProfile(userProfileId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userProfileId)) {
      throw new AppError('Invalid User Profile ID', 400);
    }
    const userProfile = await UserProfile.findByIdAndDelete(userProfileId);
    if (!userProfile) {
      throw new AppError('User Profile not found', 404);
    }
  }
}

export default new UserProfileService();
