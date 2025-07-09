import Doctor, { IDoctor } from '../../models/Doctor';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDoctorInput, UpdateDoctorInput } from './doctor.validation';
import User from '../../models/User';

class DoctorService {
  async createDoctor(userId: string, doctorData: CreateDoctorInput): Promise<IDoctor> {
    // Check if a doctor record already exists for this user
    const existingDoctor = await Doctor.findOne({ user_id: userId });
    if (existingDoctor) {
      throw new AppError('Doctor record already exists for this user', 409);
    }

    // Check if the user exists and is active
    const user = await User.findById(userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or not active', 404);
    }

    const newDoctor = await Doctor.create({ ...doctorData, user_id: userId });
    return newDoctor;
  }

  async getAllDoctors(): Promise<IDoctor[]> {
    return Doctor.find().populate('user_id').populate('specialization_id');
  }

  async getDoctorById(doctorId: string): Promise<IDoctor | null> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    const doctor = await Doctor.findById(doctorId).populate('user_id').populate('specialization_id');
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    return doctor;
  }

  async getMyDoctorProfile(userId: string): Promise<IDoctor | null> {
    const doctor = await Doctor.findOne({ user_id: userId }).populate('user_id').populate('specialization_id');
    if (!doctor) {
      throw new AppError('Doctor profile not found for this user', 404);
    }
    return doctor;
  }

  async updateDoctor(doctorId: string, doctorData: UpdateDoctorInput): Promise<IDoctor | null> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    const doctor = await Doctor.findByIdAndUpdate(doctorId, doctorData, { new: true, runValidators: true });
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    return doctor;
  }

  async deleteDoctor(doctorId: string): Promise<void> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
  }
}

export default new DoctorService();
