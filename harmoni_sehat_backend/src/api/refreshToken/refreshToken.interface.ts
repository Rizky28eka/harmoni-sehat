
import { Types } from 'mongoose';
import { IRefreshToken } from '../../models/RefreshToken';

export interface CreateRefreshTokenDto {
  user_id: Types.ObjectId; // Will be ObjectId in service
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
}

export const toRefreshTokenResponseDto = (refreshToken: IRefreshToken): IRefreshTokenResponseDto => ({
  id: (refreshToken._id as Types.ObjectId).toString(),
  user_id: (refreshToken.user_id as Types.ObjectId).toString(),
  token: refreshToken.token,
  expired_at: refreshToken.expired_at,
});
