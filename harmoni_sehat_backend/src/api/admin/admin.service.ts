import Admin, { IAdmin } from '../../models/Admin';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateAdminInput, UpdateAdminInput } from './admin.validation';
import User from '../../models/User';

class AdminService {
  async createAdmin(adminData: CreateAdminInput): Promise<IAdmin> {
    // Check if user exists
    const user = await User.findById(adminData.user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if admin profile already exists for this user
    const existingAdmin = await Admin.findOne({ user_id: adminData.user_id });
    if (existingAdmin) {
      throw new AppError('Admin profile already exists for this user', 409);
    }

    const newAdmin = await Admin.create(adminData);
    return newAdmin;
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    return Admin.find().populate('user_id');
  }

  async getAdminById(adminId: string): Promise<IAdmin | null> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new AppError('Invalid Admin ID', 400);
    }
    const admin = await Admin.findById(adminId).populate('user_id');
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
    return admin;
  }

  async getMyAdminProfile(userId: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ user_id: userId }).populate('user_id');
    if (!admin) {
      throw new AppError('Admin profile not found for this user', 404);
    }
    return admin;
  }

  async updateAdmin(adminId: string, adminData: UpdateAdminInput): Promise<IAdmin | null> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new AppError('Invalid Admin ID', 400);
    }
    const admin = await Admin.findByIdAndUpdate(adminId, adminData, { new: true, runValidators: true });
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
    return admin;
  }

  async deleteAdmin(adminId: string): Promise<void> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new AppError('Invalid Admin ID', 400);
    }
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
  }
}

export default new AdminService();
