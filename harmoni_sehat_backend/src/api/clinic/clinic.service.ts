import Clinic, { IClinic } from '../../models/Clinic';
import { AppError } from '../../utils/AppError';

class ClinicService {
  async createClinic(data: Partial<IClinic>): Promise<IClinic> {
    const existingClinic = await Clinic.findOne({ nama: data.nama });
    if (existingClinic) {
      throw new AppError('Klinik dengan nama tersebut sudah ada', 409);
    }
    const clinic = await Clinic.create(data);
    return clinic;
  }

  async getAllClinics(): Promise<IClinic[]> {
    const clinics = await Clinic.find();
    return clinics;
  }

  async getClinicById(id: string): Promise<IClinic> {
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      throw new AppError('Klinik tidak ditemukan', 404);
    }
    return clinic;
  }

  async updateClinic(id: string, data: Partial<IClinic>): Promise<IClinic> {
    const clinic = await Clinic.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!clinic) {
      throw new AppError('Klinik tidak ditemukan', 404);
    }
    return clinic;
  }

  async deleteClinic(id: string): Promise<void> {
    const clinic = await Clinic.findByIdAndDelete(id);
    if (!clinic) {
      throw new AppError('Klinik tidak ditemukan', 404);
    }
  }
}

export default new ClinicService();