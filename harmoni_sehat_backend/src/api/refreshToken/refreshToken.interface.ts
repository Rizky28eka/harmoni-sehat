import { Types } from 'mongoose';
import { IRefreshToken } from '../../models/RefreshToken';

export interface CreateRefreshTokenDto {
  user_id: string; // Will be ObjectId in service
  token: string;
  expired_at: Date;
}

export interface UpdateRefreshTokenDto {
  token?: string;
  expired_at?: Date;
}

export interface IRefreshTokenResponseDto {
  id: string;
  user_id: string;
  token: string;
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const toRefreshTokenResponseDto = (refreshToken: any): IRefreshTokenResponseDto => {
  return {
    id: refreshToken._id.toString(),
    user_id: refreshToken.user_id.toString(),
    token: refreshToken.token,
    expired_at: refreshToken.expired_at,
    createdAt: refreshToken.createdAt,
    updatedAt: refreshToken.updatedAt,
  };
};
