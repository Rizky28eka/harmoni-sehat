import MedicalRecord, { IMedicalRecord } from '../../models/MedicalRecord';
import { AppError } from '../../utils/AppError';

class MedicalRecordService {
  async createMedicalRecord(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const existingRecord = await MedicalRecord.findOne({ pasien_id: data.pasien_id });
    if (existingRecord) {
      throw new AppError('Rekam medis untuk pasien ini sudah ada', 409);
    }
    const medicalRecord = await MedicalRecord.create(data);
    return medicalRecord;
  }

  async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
    const medicalRecords = await MedicalRecord.find().populate('pasien_id');
    return medicalRecords;
  }

  async getMedicalRecordById(id: string): Promise<IMedicalRecord> {
    const medicalRecord = await MedicalRecord.findById(id).populate('pasien_id');
    if (!medicalRecord) {
      throw new AppError('Rekam medis tidak ditemukan', 404);
    }
    return medicalRecord;
  }

  async updateMedicalRecord(id: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!medicalRecord) {
      throw new AppError('Rekam medis tidak ditemukan', 404);
    }
    return medicalRecord;
  }

  async deleteMedicalRecord(id: string): Promise<void> {
    const medicalRecord = await MedicalRecord.findByIdAndDelete(id);
    if (!medicalRecord) {
      throw new AppError('Rekam medis tidak ditemukan', 404);
    }
  }
}

export default new MedicalRecordService();