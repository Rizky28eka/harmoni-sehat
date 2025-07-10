import RefreshToken, { IRefreshToken } from '../../models/RefreshToken';
import { AppError } from '../../utils/AppError';

class RefreshTokenService {
  async createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    const refreshToken = await RefreshToken.create(data);
    return refreshToken;
  }

  async getAllRefreshTokens(): Promise<IRefreshToken[]> {
    const refreshTokens = await RefreshToken.find().populate('user_id');
    return refreshTokens;
  }

  async getRefreshTokenById(id: string): Promise<IRefreshToken> {
    const refreshToken = await RefreshToken.findById(id).populate('user_id');
    if (!refreshToken) {
      throw new AppError('Refresh Token tidak ditemukan', 404);
    }
    return refreshToken;
  }

  async updateRefreshToken(id: string, data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    const refreshToken = await RefreshToken.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!refreshToken) {
      throw new AppError('Refresh Token tidak ditemukan', 404);
    }
    return refreshToken;
  }

  async deleteRefreshToken(id: string): Promise<void> {
    const refreshToken = await RefreshToken.findByIdAndDelete(id);
    if (!refreshToken) {
      throw new AppError('Refresh Token tidak ditemukan', 404);
    }
  }
}

export default new RefreshTokenService();