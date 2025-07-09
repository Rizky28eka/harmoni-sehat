import UserRole, { IUserRole } from '../../models/UserRole';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateUserRoleInput, UpdateUserRoleInput } from './userRole.validation';
import User from '../../models/User';
import Role from '../../models/Role';

class UserRoleService {
  async createUserRole(userRoleData: CreateUserRoleInput): Promise<IUserRole> {
    // Check if user and role exist
    const user = await User.findById(userRoleData.user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const role = await Role.findById(userRoleData.role_id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    // Check for existing user-role association
    const existingUserRole = await UserRole.findOne({
      user_id: userRoleData.user_id,
      role_id: userRoleData.role_id,
    });
    if (existingUserRole) {
      throw new AppError('User already has this role', 409);
    }

    const newUserRole = await UserRole.create(userRoleData);
    return newUserRole;
  }

  async getAllUserRoles(): Promise<IUserRole[]> {
    return UserRole.find().populate('user_id').populate('role_id');
  }

  async getUserRoleById(userRoleId: string): Promise<IUserRole | null> {
    if (!Types.ObjectId.isValid(userRoleId)) {
      throw new AppError('Invalid User Role ID', 400);
    }
    const userRole = await UserRole.findById(userRoleId).populate('user_id').populate('role_id');
    if (!userRole) {
      throw new AppError('User Role not found', 404);
    }
    return userRole;
  }

  async getUserRolesByUserId(userId: string): Promise<IUserRole[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid User ID', 400);
    }
    return UserRole.find({ user_id: userId }).populate('role_id');
  }

  async updateUserRole(userRoleId: string, userRoleData: UpdateUserRoleInput): Promise<IUserRole | null> {
    if (!Types.ObjectId.isValid(userRoleId)) {
      throw new AppError('Invalid User Role ID', 400);
    }
    const userRole = await UserRole.findByIdAndUpdate(userRoleId, userRoleData, { new: true, runValidators: true });
    if (!userRole) {
      throw new AppError('User Role not found', 404);
    }
    return userRole;
  }

  async deleteUserRole(userRoleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userRoleId)) {
      throw new AppError('Invalid User Role ID', 400);
    }
    const userRole = await UserRole.findByIdAndDelete(userRoleId);
    if (!userRole) {
      throw new AppError('User Role not found', 404);
    }
  }
}

export default new UserRoleService();
