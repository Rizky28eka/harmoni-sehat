import User, { IUser } from '../../models/User';
import { AppError } from '../../utils/AppError';

class UserService {
  async createUser(email: string, password: string): Promise<IUser> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User dengan email tersebut sudah ada', 409);
    }
    const user = await User.create({ email, password });
    return user;
  }

 

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }
  }
}

export default new UserService();