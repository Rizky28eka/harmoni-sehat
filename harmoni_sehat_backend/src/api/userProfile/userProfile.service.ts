import UserProfile, { IUserProfile } from '../../models/UserProfile';
import { AppError } from '../../utils/AppError';

class UserProfileService {
  async createUserProfile(data: Partial<IUserProfile>): Promise<IUserProfile> {
    const existingProfile = await UserProfile.findOne({ user_id: data.user_id });
    if (existingProfile) {
      throw new AppError('Profil pengguna untuk user ini sudah ada', 409);
    }
    const userProfile = await UserProfile.create(data);
    return userProfile;
  }

  async getAllUserProfiles(): Promise<IUserProfile[]> {
    const userProfiles = await UserProfile.find().populate('user_id');
    return userProfiles;
  }

  async getUserProfileById(id: string): Promise<IUserProfile> {
    const userProfile = await UserProfile.findById(id).populate('user_id');
    if (!userProfile) {
      throw new AppError('Profil pengguna tidak ditemukan', 404);
    }
    return userProfile;
  }

  async updateUserProfile(id: string, data: Partial<IUserProfile>): Promise<IUserProfile> {
    const userProfile = await UserProfile.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!userProfile) {
      throw new AppError('Profil pengguna tidak ditemukan', 404);
    }
    return userProfile;
  }

  async deleteUserProfile(id: string): Promise<void> {
    const userProfile = await UserProfile.findByIdAndDelete(id);
    if (!userProfile) {
      throw new AppError('Profil pengguna tidak ditemukan', 404);
    }
  }
}

export default new UserProfileService();