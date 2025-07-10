import Specialization, { ISpecialization } from '../../models/Specialization';
import { AppError } from '../../utils/AppError';

class SpecializationService {
  async createSpecialization(nama: string, deskripsi?: string): Promise<ISpecialization> {
    const existingSpecialization = await Specialization.findOne({ nama });
    if (existingSpecialization) {
      throw new AppError('Spesialisasi dengan nama tersebut sudah ada', 409);
    }
    const specialization = await Specialization.create({ nama, deskripsi });
    return specialization;
  }

  async getAllSpecializations(): Promise<ISpecialization[]> {
    const specializations = await Specialization.find();
    return specializations;
  }

  async getSpecializationById(id: string): Promise<ISpecialization> {
    const specialization = await Specialization.findById(id);
    if (!specialization) {
      throw new AppError('Spesialisasi tidak ditemukan', 404);
    }
    return specialization;
  }

  async updateSpecialization(id: string, data: Partial<ISpecialization>): Promise<ISpecialization> {
    const specialization = await Specialization.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!specialization) {
      throw new AppError('Spesialisasi tidak ditemukan', 404);
    }
    return specialization;
  }

  async deleteSpecialization(id: string): Promise<void> {
    const specialization = await Specialization.findByIdAndDelete(id);
    if (!specialization) {
      throw new AppError('Spesialisasi tidak ditemukan', 404);
    }
  }
}

export default new SpecializationService();