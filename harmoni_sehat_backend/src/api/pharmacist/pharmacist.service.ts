import Pharmacist, { IPharmacist } from '../../models/Pharmacist';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePharmacistInput, UpdatePharmacistInput } from './pharmacist.validation';
import User from '../../models/User';

class PharmacistService {
  async createPharmacist(userId: string, pharmacistData: CreatePharmacistInput): Promise<IPharmacist> {
    // Check if a pharmacist record already exists for this user
    const existingPharmacist = await Pharmacist.findOne({ user_id: userId });
    if (existingPharmacist) {
      throw new AppError('Pharmacist record already exists for this user', 409);
    }

    // Check if the user exists and is active
    const user = await User.findById(userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or not active', 404);
    }

    const newPharmacist = await Pharmacist.create({ ...pharmacistData, user_id: userId });
    return newPharmacist;
  }

  async getAllPharmacists(): Promise<IPharmacist[]> {
    return Pharmacist.find().populate('user_id');
  }

  async getPharmacistById(pharmacistId: string): Promise<IPharmacist | null> {
    if (!Types.ObjectId.isValid(pharmacistId)) {
      throw new AppError('Invalid Pharmacist ID', 400);
    }
    const pharmacist = await Pharmacist.findById(pharmacistId).populate('user_id');
    if (!pharmacist) {
      throw new AppError('Pharmacist not found', 404);
    }
    return pharmacist;
  }

  async getMyPharmacistProfile(userId: string): Promise<IPharmacist | null> {
    const pharmacist = await Pharmacist.findOne({ user_id: userId }).populate('user_id');
    if (!pharmacist) {
      throw new AppError('Pharmacist profile not found for this user', 404);
    }
    return pharmacist;
  }

  async updatePharmacist(pharmacistId: string, pharmacistData: UpdatePharmacistInput): Promise<IPharmacist | null> {
    if (!Types.ObjectId.isValid(pharmacistId)) {
      throw new AppError('Invalid Pharmacist ID', 400);
    }
    const pharmacist = await Pharmacist.findByIdAndUpdate(pharmacistId, pharmacistData, { new: true, runValidators: true });
    if (!pharmacist) {
      throw new AppError('Pharmacist not found', 404);
    }
    return pharmacist;
  }

  async deletePharmacist(pharmacistId: string): Promise<void> {
    if (!Types.ObjectId.isValid(pharmacistId)) {
      throw new AppError('Invalid Pharmacist ID', 400);
    }
    const pharmacist = await Pharmacist.findByIdAndDelete(pharmacistId);
    if (!pharmacist) {
      throw new AppError('Pharmacist not found', 404);
    }
  }
}

export default new PharmacistService();
