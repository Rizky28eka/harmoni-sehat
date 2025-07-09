import MedicalRecord, { IMedicalRecord } from '../../models/MedicalRecord';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './medicalRecord.interface';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';

class MedicalRecordService {
  async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
    return MedicalRecord.find().populate('patient_id');
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

  async createMedicalRecord(recordData: CreateMedicalRecordDto): Promise<IMedicalRecord> {
    if (!Types.ObjectId.isValid(recordData.patient_id)) {
      throw new AppError('Invalid Pasien ID', 400);
    }
    const newRecord = await MedicalRecord.create(recordData);
    return newRecord;
  }

  async updateMedicalRecord(id: string, recordData: UpdateMedicalRecordDto): Promise<IMedicalRecord | null> {
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
