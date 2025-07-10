import Pasien, { IPasien } from '../../models/Pasien';
import { AppError } from '../../utils/AppError';

class PatientService {
  async createPatient(data: Partial<IPasien>): Promise<IPasien> {
    const existingPatient = await Pasien.findOne({ user_id: data.user_id });
    if (existingPatient) {
      throw new AppError('Pasien dengan user ID ini sudah ada', 409);
    }
    const patient = await Pasien.create(data);
    return patient;
  }

  async getAllPatients(): Promise<IPasien[]> {
    const patients = await Pasien.find().populate('user_id');
    return patients;
  }

  async getPatientById(id: string): Promise<IPasien> {
    const patient = await Pasien.findById(id).populate('user_id');
    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }
    return patient;
  }

  async updatePatient(id: string, data: Partial<IPasien>): Promise<IPasien> {
    const patient = await Pasien.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }
    return patient;
  }

  async deletePatient(id: string): Promise<void> {
    const patient = await Pasien.findByIdAndDelete(id);
    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }
  }
}

export default new PatientService();