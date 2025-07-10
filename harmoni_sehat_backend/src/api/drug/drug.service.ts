import Drug, { IDrug } from '../../models/Drug';
import { AppError } from '../../utils/AppError';

class DrugService {
  async createDrug(data: Partial<IDrug>): Promise<IDrug> {
    const existingDrug = await Drug.findOne({ kode_obat: data.kode_obat });
    if (existingDrug) {
      throw new AppError('Obat dengan kode tersebut sudah ada', 409);
    }
    const drug = await Drug.create(data);
    return drug;
  }

  async getAllDrugs(): Promise<IDrug[]> {
    const drugs = await Drug.find();
    return drugs;
  }

  async getDrugById(id: string): Promise<IDrug> {
    const drug = await Drug.findById(id);
    if (!drug) {
      throw new AppError('Obat tidak ditemukan', 404);
    }
    return drug;
  }

  async updateDrug(id: string, data: Partial<IDrug>): Promise<IDrug> {
    const drug = await Drug.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!drug) {
      throw new AppError('Obat tidak ditemukan', 404);
    }
    return drug;
  }

  async deleteDrug(id: string): Promise<void> {
    const drug = await Drug.findByIdAndDelete(id);
    if (!drug) {
      throw new AppError('Obat tidak ditemukan', 404);
    }
  }
}

export default new DrugService();