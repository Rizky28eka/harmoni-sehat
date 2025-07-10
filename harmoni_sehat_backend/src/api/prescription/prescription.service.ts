import Prescription, { IPrescription } from '../../models/Prescription';
import { AppError } from '../../utils/AppError';

class PrescriptionService {
  async createPrescription(data: Partial<IPrescription>): Promise<IPrescription> {
    const existingPrescription = await Prescription.findOne({ konsultasi_id: data.konsultasi_id });
    if (existingPrescription) {
      throw new AppError('Resep untuk konsultasi ini sudah ada', 409);
    }
    const prescription = await Prescription.create(data);
    return prescription;
  }

  async getAllPrescriptions(): Promise<IPrescription[]> {
    const prescriptions = await Prescription.find().populate('konsultasi_id');
    return prescriptions;
  }

  async getPrescriptionById(id: string): Promise<IPrescription> {
    const prescription = await Prescription.findById(id).populate('konsultasi_id');
    if (!prescription) {
      throw new AppError('Resep tidak ditemukan', 404);
    }
    return prescription;
  }

  async updatePrescription(id: string, data: Partial<IPrescription>): Promise<IPrescription> {
    const prescription = await Prescription.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!prescription) {
      throw new AppError('Resep tidak ditemukan', 404);
    }
    return prescription;
  }

  async deletePrescription(id: string): Promise<void> {
    const prescription = await Prescription.findByIdAndDelete(id);
    if (!prescription) {
      throw new AppError('Resep tidak ditemukan', 404);
    }
  }
}

export default new PrescriptionService();