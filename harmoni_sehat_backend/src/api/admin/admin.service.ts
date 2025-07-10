import Admin, { IAdmin } from '../../models/Admin';
import { AppError } from '../../utils/AppError';

class AdminService {
  async createAdmin(data: Partial<IAdmin>): Promise<IAdmin> {
    const existingAdmin = await Admin.findOne({ user_id: data.user_id });
    if (existingAdmin) {
      throw new AppError('Admin dengan user ID ini sudah ada', 409);
    }
    const admin = await Admin.create(data);
    return admin;
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    const admins = await Admin.find().populate('user_id');
    return admins;
  }

  async getAdminById(id: string): Promise<IAdmin> {
    const admin = await Admin.findById(id).populate('user_id');
    if (!admin) {
      throw new AppError('Admin tidak ditemukan', 404);
    }
    return admin;
  }

  async updateAdmin(id: string, data: Partial<IAdmin>): Promise<IAdmin> {
    const admin = await Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!admin) {
      throw new AppError('Admin tidak ditemukan', 404);
    }
    return admin;
  }

  async deleteAdmin(id: string): Promise<void> {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new AppError('Admin tidak ditemukan', 404);
    }
  }
}

export default new AdminService();