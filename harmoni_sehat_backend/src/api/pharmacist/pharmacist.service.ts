import Apoteker, { IApoteker } from '../../models/Apoteker';
import { AppError } from '../../utils/AppError';

class PharmacistService {
  async createPharmacist(data: Partial<IApoteker>): Promise<IApoteker> {
    const existingPharmacist = await Apoteker.findOne({ user_id: data.user_id });
    if (existingPharmacist) {
      throw new AppError('Apoteker dengan user ID ini sudah ada', 409);
    }
    const pharmacist = await Apoteker.create(data);
    return pharmacist;
  }

  async getAllPharmacists(): Promise<IApoteker[]> {
    const pharmacists = await Apoteker.find().populate('user_id');
    return pharmacists;
  }

  async getPharmacistById(id: string): Promise<IApoteker> {
    const pharmacist = await Apoteker.findById(id).populate('user_id');
    if (!pharmacist) {
      throw new AppError('Apoteker tidak ditemukan', 404);
    }
    return pharmacist;
  }

  async updatePharmacist(id: string, data: Partial<IApoteker>): Promise<IApoteker> {
    const pharmacist = await Apoteker.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!pharmacist) {
      throw new AppError('Apoteker tidak ditemukan', 404);
    }
    return pharmacist;
  }

  async deletePharmacist(id: string): Promise<void> {
    const pharmacist = await Apoteker.findByIdAndDelete(id);
    if (!pharmacist) {
      throw new AppError('Apoteker tidak ditemukan', 404);
    }
  }
}

export default new PharmacistService();