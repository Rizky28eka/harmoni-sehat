import { Request, Response, NextFunction } from 'express';
import UserProfileService from './userProfile.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toUserProfileResponseDto } from './userProfile.interface';
import { CreateUserProfileInput, UpdateUserProfileInput } from './userProfile.validation';

class UserProfileController {
  async createUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfileData: CreateUserProfileInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newUserProfile = await UserProfileService.createUserProfile(userId.toString(), userProfileData);
      res.status(201).json(new ApiResponse(201, toUserProfileResponseDto(newUserProfile), 'User profile created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllUserProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfiles = await UserProfileService.getAllUserProfiles();
      res.status(200).json(new ApiResponse(200, userProfiles.map(toUserProfileResponseDto), 'User profiles fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUserProfileById(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = await UserProfileService.getUserProfileById(req.params.id);

      // Ownership authorization: User can only access their own profile
      if (req.user?._id.toString() !== userProfile?.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access this user profile.', 403));
      }

      res.status(200).json(new ApiResponse(200, toUserProfileResponseDto(userProfile!), 'User profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const userProfile = await UserProfileService.getMyUserProfile(userId.toString());
      res.status(200).json(new ApiResponse(200, toUserProfileResponseDto(userProfile!), 'My user profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfileData: UpdateUserProfileInput = req.body;
      const userProfileId = req.params.id; // ID of the user profile to update

      // Get the user profile first to check ownership
      const existingUserProfile = await UserProfileService.getUserProfileById(userProfileId);
      if (!existingUserProfile) {
        return next(new AppError('User Profile not found', 404));
      }

      // Ownership authorization: User can only update their own profile
      if (req.user?._id.toString() !== existingUserProfile.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to update this user profile.', 403));
      }

      const updatedUserProfile = await UserProfileService.updateUserProfile(userProfileId, userProfileData);
      res.status(200).json(new ApiResponse(200, toUserProfileResponseDto(updatedUserProfile!), 'User profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfileId = req.params.id; // ID of the user profile to delete

      // Get the user profile first to check ownership
      const existingUserProfile = await UserProfileService.getUserProfileById(userProfileId);
      if (!existingUserProfile) {
        return next(new AppError('User Profile not found', 404));
      }

      // Ownership authorization: User can only delete their own profile
      if (req.user?._id.toString() !== existingUserProfile.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to delete this user profile.', 403));
      }

      await UserProfileService.deleteUserProfile(userProfileId);
      res.status(204).json(new ApiResponse(204, null, 'User profile deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new UserProfileController();
