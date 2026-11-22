import User, { IUser } from '../../models/User';
import Role from '../../models/Role';
import RefreshToken from '../../models/RefreshToken';
import { AppError } from '../../utils/AppError';

class UserService {
  async createUser(email: string, password: string, roleName: string): Promise<IUser> {
    if (await User.findOne({ email })) {
      throw new AppError('User dengan email tersebut sudah ada', 409);
    }
    const role = await Role.findOne({ nama_peran: roleName });
    if (!role) throw new AppError('Role tidak ditemukan', 400);
    const user = await User.create({ email, password, role: role._id });
    return (await User.findById(user._id).populate('role'))!;
  }

  async updateUser(id: string, data: { email?: string; is_active?: boolean; role?: string }): Promise<IUser> {
    const update: Record<string, any> = {};
    if (data.email !== undefined) update.email = data.email;
    if (data.is_active !== undefined) update.is_active = data.is_active;
    if (data.role) {
      const role = await Role.findOne({ nama_peran: data.role });
      if (!role) throw new AppError('Role tidak ditemukan', 400);
      update.role = role._id;
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('role');
    if (!user) throw new AppError('User tidak ditemukan', 404);
    if (data.is_active === false) await RefreshToken.deleteMany({ user_id: id });
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User tidak ditemukan', 404);
    await RefreshToken.deleteMany({ user_id: id });
  }
}

export default new UserService();
