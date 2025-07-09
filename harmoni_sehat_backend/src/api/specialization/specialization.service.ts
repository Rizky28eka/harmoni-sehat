import Specialization, { ISpecialization } from '../../models/Specialization';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateSpecializationInput, UpdateSpecializationInput } from './specialization.validation';

class SpecializationService {
  async createSpecialization(specializationData: CreateSpecializationInput): Promise<ISpecialization> {
    const existingSpecialization = await Specialization.findOne({ nama: specializationData.nama });
    if (existingSpecialization) {
      throw new AppError('Specialization with this name already exists', 409);
    }
    const newSpecialization = await Specialization.create(specializationData);
    return newSpecialization;
  }

  async getAllSpecializations(): Promise<ISpecialization[]> {
    return Specialization.find();
  }

  async getSpecializationById(specializationId: string): Promise<ISpecialization | null> {
    if (!Types.ObjectId.isValid(specializationId)) {
      throw new AppError('Invalid Specialization ID', 400);
    }
    const specialization = await Specialization.findById(specializationId);
    if (!specialization) {
      throw new AppError('Specialization not found', 404);
    }
    return specialization;
  }

  async updateSpecialization(specializationId: string, specializationData: UpdateSpecializationInput): Promise<ISpecialization | null> {
    if (!Types.ObjectId.isValid(specializationId)) {
      throw new AppError('Invalid Specialization ID', 400);
    }
    const specialization = await Specialization.findByIdAndUpdate(specializationId, specializationData, { new: true, runValidators: true });
    if (!specialization) {
      throw new AppError('Specialization not found', 404);
    }
    return specialization;
  }

  async deleteSpecialization(specializationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(specializationId)) {
      throw new AppError('Invalid Specialization ID', 400);
    }
    const specialization = await Specialization.findByIdAndDelete(specializationId);
    if (!specialization) {
      throw new AppError('Specialization not found', 404);
    }
  }
}

export default new SpecializationService();
