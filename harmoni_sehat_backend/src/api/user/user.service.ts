import User, { IUser } from '../../models/User';
import { CreateUserDto, UpdateUserDto } from './user.interface';
import AppError from '../../utils/AppError';

class UserService {
  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }
    const newUser = await User.create(userData);
    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
  }
}

export default new UserService();
