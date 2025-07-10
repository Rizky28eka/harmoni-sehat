import DoctorClinic, { IDoctorClinic } from '../../models/DoctorClinic';
import { AppError } from '../../utils/AppError';

class DoctorClinicService {
  async createDoctorClinic(data: Partial<IDoctorClinic>): Promise<IDoctorClinic> {
    const existingDoctorClinic = await DoctorClinic.findOne({ dokter_id: data.dokter_id, klinik_id: data.klinik_id });
    if (existingDoctorClinic) {
      throw new AppError('Dokter sudah terdaftar di klinik ini', 409);
    }
    const doctorClinic = await DoctorClinic.create(data);
    return doctorClinic;
  }

  async getAllDoctorClinics(): Promise<IDoctorClinic[]> {
    const doctorClinics = await DoctorClinic.find().populate('dokter_id').populate('klinik_id');
    return doctorClinics;
  }

  async getDoctorClinicById(id: string): Promise<IDoctorClinic> {
    const doctorClinic = await DoctorClinic.findById(id).populate('dokter_id').populate('klinik_id');
    if (!doctorClinic) {
      throw new AppError('Dokter Klinik tidak ditemukan', 404);
    }
    return doctorClinic;
  }

  async updateDoctorClinic(id: string, data: Partial<IDoctorClinic>): Promise<IDoctorClinic> {
    const doctorClinic = await DoctorClinic.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doctorClinic) {
      throw new AppError('Dokter Klinik tidak ditemukan', 404);
    }
    return doctorClinic;
  }

  async deleteDoctorClinic(id: string): Promise<void> {
    const doctorClinic = await DoctorClinic.findByIdAndDelete(id);
    if (!doctorClinic) {
      throw new AppError('Dokter Klinik tidak ditemukan', 404);
    }
  }
}

export default new DoctorClinicService();