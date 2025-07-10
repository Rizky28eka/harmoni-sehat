import Dokter, { IDokter } from '../../models/Dokter';
import { AppError } from '../../utils/AppError';

class DoctorService {
  async createDoctor(data: Partial<IDokter>): Promise<IDokter> {
    const existingDoctor = await Dokter.findOne({ user_id: data.user_id });
    if (existingDoctor) {
      throw new AppError('Dokter dengan user ID ini sudah ada', 409);
    }
    const doctor = await Dokter.create(data);
    return doctor;
  }

  async getAllDoctors(): Promise<IDokter[]> {
    const doctors = await Dokter.find().populate('user_id').populate('spesialisasi_id');
    return doctors;
  }

  async getDoctorById(id: string): Promise<IDokter> {
    const doctor = await Dokter.findById(id).populate('user_id').populate('spesialisasi_id');
    if (!doctor) {
      throw new AppError('Dokter tidak ditemukan', 404);
    }
    return doctor;
  }

  async updateDoctor(id: string, data: Partial<IDokter>): Promise<IDokter> {
    const doctor = await Dokter.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doctor) {
      throw new AppError('Dokter tidak ditemukan', 404);
    }
    return doctor;
  }

  async deleteDoctor(id: string): Promise<void> {
    const doctor = await Dokter.findByIdAndDelete(id);
    if (!doctor) {
      throw new AppError('Dokter tidak ditemukan', 404);
    }
  }
}

export default new DoctorService();