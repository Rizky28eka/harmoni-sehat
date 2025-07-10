import UserRole, { IUserRole } from '../../models/UserRole';
import { AppError } from '../../utils/AppError';

class UserRoleService {
  async createUserRole(user_id: string, peran_id: string): Promise<IUserRole> {
    const existingUserRole = await UserRole.findOne({ user_id, peran_id });
    if (existingUserRole) {
      throw new AppError('User sudah memiliki peran ini', 409);
    }
    const userRole = await UserRole.create({ user_id, peran_id });
    return userRole;
  }

  async getAllUserRoles(): Promise<IUserRole[]> {
    const userRoles = await UserRole.find().populate('user_id').populate('peran_id');
    return userRoles;
  }

  async getUserRoleById(id: string): Promise<IUserRole> {
    const userRole = await UserRole.findById(id).populate('user_id').populate('peran_id');
    if (!userRole) {
      throw new AppError('User Role tidak ditemukan', 404);
    }
    return userRole;
  }

  async updateUserRole(id: string, data: Partial<IUserRole>): Promise<IUserRole> {
    const userRole = await UserRole.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!userRole) {
      throw new AppError('User Role tidak ditemukan', 404);
    }
    return userRole;
  }

  async deleteUserRole(id: string): Promise<void> {
    const userRole = await UserRole.findByIdAndDelete(id);
    if (!userRole) {
      throw new AppError('User Role tidak ditemukan', 404);
    }
  }
}

export default new UserRoleService();