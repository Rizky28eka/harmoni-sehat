import Role, { IRole } from '../../models/Role';
import { AppError } from '../../utils/AppError';

class RoleService {
  async createRole(nama_peran: string): Promise<IRole> {
    const existingRole = await Role.findOne({ nama_peran });
    if (existingRole) {
      throw new AppError('Role dengan nama tersebut sudah ada', 409);
    }
    const role = await Role.create({ nama_peran });
    return role;
  }

  async getAllRoles(): Promise<IRole[]> {
    const roles = await Role.find();
    return roles;
  }

  async getRoleById(id: string): Promise<IRole> {
    const role = await Role.findById(id);
    if (!role) {
      throw new AppError('Role tidak ditemukan', 404);
    }
    return role;
  }

  async updateRole(id: string, nama_peran: string): Promise<IRole> {
    const role = await Role.findByIdAndUpdate(id, { nama_peran }, { new: true, runValidators: true });
    if (!role) {
      throw new AppError('Role tidak ditemukan', 404);
    }
    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      throw new AppError('Role tidak ditemukan', 404);
    }
  }
}

export default new RoleService();