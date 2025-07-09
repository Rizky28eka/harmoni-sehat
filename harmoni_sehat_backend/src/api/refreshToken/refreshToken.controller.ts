import { Request, Response, NextFunction } from 'express';
import RefreshTokenService from './refreshToken.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toRefreshTokenResponseDto } from './refreshToken.interface';
import { CreateRefreshTokenInput, UpdateRefreshTokenInput } from './refreshToken.validation';

class RefreshTokenController {
  async createRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenData: CreateRefreshTokenInput = req.body;
      const newRefreshToken = await RefreshTokenService.createRefreshToken(refreshTokenData);
      res.status(201).json(new ApiResponse(201, toRefreshTokenResponseDto(newRefreshToken), 'Refresh token created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllRefreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokens = await RefreshTokenService.getAllRefreshTokens();
      res.status(200).json(new ApiResponse(200, refreshTokens.map(toRefreshTokenResponseDto), 'Refresh tokens fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getRefreshTokenById(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = await RefreshTokenService.getRefreshTokenById(req.params.id);
      res.status(200).json(new ApiResponse(200, toRefreshTokenResponseDto(refreshToken!), 'Refresh token fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenData: UpdateRefreshTokenInput = req.body;
      const refreshTokenId = req.params.id;
      const updatedRefreshToken = await RefreshTokenService.updateRefreshToken(refreshTokenId, refreshTokenData);
      res.status(200).json(new ApiResponse(200, toRefreshTokenResponseDto(updatedRefreshToken!), 'Refresh token updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenId = req.params.id;
      await RefreshTokenService.deleteRefreshToken(refreshTokenId);
      res.status(204).json(new ApiResponse(204, null, 'Refresh token deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new RefreshTokenController();
