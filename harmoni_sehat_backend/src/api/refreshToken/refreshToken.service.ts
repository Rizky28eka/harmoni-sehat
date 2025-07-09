import RefreshToken, { IRefreshToken } from '../../models/RefreshToken';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateRefreshTokenInput, UpdateRefreshTokenInput } from './refreshToken.validation';
import User from '../../models/User';

class RefreshTokenService {
  async createRefreshToken(refreshTokenData: CreateRefreshTokenInput): Promise<IRefreshToken> {
    // Check if user exists
    const user = await User.findById(refreshTokenData.user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newRefreshToken = await RefreshToken.create(refreshTokenData);
    return newRefreshToken;
  }

  async getAllRefreshTokens(): Promise<IRefreshToken[]> {
    return RefreshToken.find().populate('user_id');
  }

  async getRefreshTokenById(refreshTokenId: string): Promise<IRefreshToken | null> {
    if (!Types.ObjectId.isValid(refreshTokenId)) {
      throw new AppError('Invalid Refresh Token ID', 400);
    }
    const refreshToken = await RefreshToken.findById(refreshTokenId).populate('user_id');
    if (!refreshToken) {
      throw new AppError('Refresh Token not found', 404);
    }
    return refreshToken;
  }

  async updateRefreshToken(refreshTokenId: string, refreshTokenData: UpdateRefreshTokenInput): Promise<IRefreshToken | null> {
    if (!Types.ObjectId.isValid(refreshTokenId)) {
      throw new AppError('Invalid Refresh Token ID', 400);
    }
    const refreshToken = await RefreshToken.findByIdAndUpdate(refreshTokenId, refreshTokenData, { new: true, runValidators: true });
    if (!refreshToken) {
      throw new AppError('Refresh Token not found', 404);
    }
    return refreshToken;
  }

  async deleteRefreshToken(refreshTokenId: string): Promise<void> {
    if (!Types.ObjectId.isValid(refreshTokenId)) {
      throw new AppError('Invalid Refresh Token ID', 400);
    }
    const refreshToken = await RefreshToken.findByIdAndDelete(refreshTokenId);
    if (!refreshToken) {
      throw new AppError('Refresh Token not found', 404);
    }
  }
}

export default new RefreshTokenService();
