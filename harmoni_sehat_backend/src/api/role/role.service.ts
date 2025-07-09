import Role, { IRole } from '../../models/Role';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateRoleInput, UpdateRoleInput } from './role.validation';

class RoleService {
  async createRole(roleData: CreateRoleInput): Promise<IRole> {
    const existingRole = await Role.findOne({ nama_peran: roleData.nama_peran });
    if (existingRole) {
      throw new AppError('Role with this name already exists', 409);
    }
    const newRole = await Role.create(roleData);
    return newRole;
  }

  async getAllRoles(): Promise<IRole[]> {
    return Role.find();
  }

  async getRoleById(roleId: string): Promise<IRole | null> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid Role ID', 400);
    }
    const role = await Role.findById(roleId);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async updateRole(roleId: string, roleData: UpdateRoleInput): Promise<IRole | null> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid Role ID', 400);
    }
    const role = await Role.findByIdAndUpdate(roleId, roleData, { new: true, runValidators: true });
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async deleteRole(roleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid Role ID', 400);
    }
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
  }
}

export default new RoleService();
