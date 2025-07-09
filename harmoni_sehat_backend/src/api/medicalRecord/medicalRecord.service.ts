import MedicalRecord, { IMedicalRecord } from '../../models/MedicalRecord';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateMedicalRecordInput, UpdateMedicalRecordInput } from './medicalRecord.validation';

class MedicalRecordService {
  // Get all medical records for a specific patient
  async getMyMedicalRecord(patientId: string): Promise<IMedicalRecord | null> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    // In a real app, you might find based on a user ID reference
    return MedicalRecord.findOne({ patient_id: patientId }).populate('patient_id');
  }

  async getMedicalRecordById(id: string): Promise<IMedicalRecord | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Medical Record ID', 400);
    }
    const record = await MedicalRecord.findById(id).populate('patient_id');
    if (!record) {
      throw new AppError('Medical Record not found', 404);
    }
    return record;
  }

  // Create a medical record for a specific patient ID (from logged-in user)
  async createMedicalRecord(patientId: string, recordData: CreateMedicalRecordInput): Promise<IMedicalRecord> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    
    const existingRecord = await MedicalRecord.findOne({ patient_id: patientId });
    if (existingRecord) {
        throw new AppError('Medical record for this patient already exists', 409);
    }

    const newRecord = await MedicalRecord.create({ ...recordData, patient_id: patientId });
    return newRecord;
  }

  async updateMedicalRecord(id: string, recordData: UpdateMedicalRecordInput): Promise<IMedicalRecord | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Medical Record ID', 400);
    }
    const record = await MedicalRecord.findByIdAndUpdate(id, recordData, { new: true, runValidators: true });
    if (!record) {
      throw new AppError('Medical Record not found', 404);
    }
    return record;
  }

  async deleteMedicalRecord(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Medical Record ID', 400);
    }
    const record = await MedicalRecord.findByIdAndDelete(id);
    if (!record) {
      throw new AppError('Medical Record not found', 404);
    }
  }
}

export default new MedicalRecordService();
