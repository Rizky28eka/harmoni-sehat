import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import { CreateUserDto, UpdateUserDto, toUserResponseDto } from './user.interface';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(new ApiResponse(200, users.map(toUserResponseDto), 'Users fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json(new ApiResponse(200, toUserResponseDto(user!), 'User fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json(new ApiResponse(201, toUserResponseDto(newUser), 'User created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: UpdateUserDto = req.body;
      const updatedUser = await UserService.updateUser(req.params.id, userData);
      res.status(200).json(new ApiResponse(200, toUserResponseDto(updatedUser!), 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).json(new ApiResponse(204, null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
