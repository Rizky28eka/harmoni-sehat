import Clinic, { IClinic } from '../../models/Clinic';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateClinicInput, UpdateClinicInput } from './clinic.validation';

class ClinicService {
  async createClinic(clinicData: CreateClinicInput): Promise<IClinic> {
    const existingClinic = await Clinic.findOne({ email: clinicData.email });
    if (existingClinic) {
      throw new AppError('Clinic with this email already exists', 409);
    }
    const newClinic = await Clinic.create(clinicData);
    return newClinic;
  }

  async getAllClinics(): Promise<IClinic[]> {
    return Clinic.find();
  }

  async getClinicById(clinicId: string): Promise<IClinic | null> {
    if (!Types.ObjectId.isValid(clinicId)) {
      throw new AppError('Invalid Clinic ID', 400);
    }
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }
    return clinic;
  }

  async updateClinic(clinicId: string, clinicData: UpdateClinicInput): Promise<IClinic | null> {
    if (!Types.ObjectId.isValid(clinicId)) {
      throw new AppError('Invalid Clinic ID', 400);
    }
    const clinic = await Clinic.findByIdAndUpdate(clinicId, clinicData, { new: true, runValidators: true });
    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }
    return clinic;
  }

  async deleteClinic(clinicId: string): Promise<void> {
    if (!Types.ObjectId.isValid(clinicId)) {
      throw new AppError('Invalid Clinic ID', 400);
    }
    const clinic = await Clinic.findByIdAndDelete(clinicId);
    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }
  }
}

export default new ClinicService();
