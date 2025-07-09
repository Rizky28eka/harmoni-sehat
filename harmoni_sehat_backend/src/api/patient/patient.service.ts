import Patient, { IPatient } from '../../models/Patient';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePatientInput, UpdatePatientInput } from './patient.validation';
import User from '../../models/User';

class PatientService {
  async createPatient(userId: string, patientData: CreatePatientInput): Promise<IPatient> {
    // Check if a patient record already exists for this user
    const existingPatient = await Patient.findOne({ user_id: userId });
    if (existingPatient) {
      throw new AppError('Patient record already exists for this user', 409);
    }

    // Check if the user exists and is active
    const user = await User.findById(userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or not active', 404);
    }

    const newPatient = await Patient.create({ ...patientData, user_id: userId });
    return newPatient;
  }

  async getAllPatients(): Promise<IPatient[]> {
    // This method might need authorization (e.g., only for admins/doctors)
    return Patient.find().populate('user_id');
  }

  async getPatientById(patientId: string): Promise<IPatient | null> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    const patient = await Patient.findById(patientId).populate('user_id');
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    return patient;
  }

  async getMyPatientProfile(userId: string): Promise<IPatient | null> {
    const patient = await Patient.findOne({ user_id: userId }).populate('user_id');
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }
    return patient;
  }

  async updatePatient(patientId: string, patientData: UpdatePatientInput): Promise<IPatient | null> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    const patient = await Patient.findByIdAndUpdate(patientId, patientData, { new: true, runValidators: true });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    return patient;
  }

  async deletePatient(patientId: string): Promise<void> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    const patient = await Patient.findByIdAndDelete(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
  }
}

export default new PatientService();
