import PrescriptionDrug, { IPrescriptionDrug } from '../../models/PrescriptionDrug';
import { AppError } from '../../utils/AppError';

class PrescriptionDrugService {
  async createPrescriptionDrug(data: Partial<IPrescriptionDrug>): Promise<IPrescriptionDrug> {
    const prescriptionDrug = await PrescriptionDrug.create(data);
    return prescriptionDrug;
  }

  async getAllPrescriptionDrugs(): Promise<IPrescriptionDrug[]> {
    const prescriptionDrugs = await PrescriptionDrug.find().populate('resep_id').populate('obat_id');
    return prescriptionDrugs;
  }

  async getPrescriptionDrugById(id: string): Promise<IPrescriptionDrug> {
    const prescriptionDrug = await PrescriptionDrug.findById(id).populate('resep_id').populate('obat_id');
    if (!prescriptionDrug) {
      throw new AppError('Obat resep tidak ditemukan', 404);
    }
    return prescriptionDrug;
  }

  async updatePrescriptionDrug(id: string, data: Partial<IPrescriptionDrug>): Promise<IPrescriptionDrug> {
    const prescriptionDrug = await PrescriptionDrug.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!prescriptionDrug) {
      throw new AppError('Obat resep tidak ditemukan', 404);
    }
    return prescriptionDrug;
  }

  async deletePrescriptionDrug(id: string): Promise<void> {
    const prescriptionDrug = await PrescriptionDrug.findByIdAndDelete(id);
    if (!prescriptionDrug) {
      throw new AppError('Obat resep tidak ditemukan', 404);
    }
  }
}

export default new PrescriptionDrugService();