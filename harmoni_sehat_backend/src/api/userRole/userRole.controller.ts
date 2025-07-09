import { Request, Response, NextFunction } from 'express';
import UserRoleService from './userRole.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toUserRoleResponseDto } from './userRole.interface';
import { CreateUserRoleInput, UpdateUserRoleInput } from './userRole.validation';

class UserRoleController {
  async createUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoleData: CreateUserRoleInput = req.body;
      const newUserRole = await UserRoleService.createUserRole(userRoleData);
      res.status(201).json(new ApiResponse(201, toUserRoleResponseDto(newUserRole), 'User role created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = await UserRoleService.getAllUserRoles();
      res.status(200).json(new ApiResponse(200, userRoles.map(toUserRoleResponseDto), 'User roles fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUserRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = await UserRoleService.getUserRoleById(req.params.id);
      res.status(200).json(new ApiResponse(200, toUserRoleResponseDto(userRole!), 'User role fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUserRolesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const userRoles = await UserRoleService.getUserRolesByUserId(userId);
      res.status(200).json(new ApiResponse(200, userRoles.map(toUserRoleResponseDto), 'User roles for user fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoleData: UpdateUserRoleInput = req.body;
      const userRoleId = req.params.id;
      const updatedUserRole = await UserRoleService.updateUserRole(userRoleId, userRoleData);
      res.status(200).json(new ApiResponse(200, toUserRoleResponseDto(updatedUserRole!), 'User role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoleId = req.params.id;
      await UserRoleService.deleteUserRole(userRoleId);
      res.status(204).json(new ApiResponse(204, null, 'User role deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new UserRoleController();
