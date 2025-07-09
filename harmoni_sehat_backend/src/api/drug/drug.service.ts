import Drug, { IDrug } from '../../models/Drug';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDrugInput, UpdateDrugInput } from './drug.validation';

class DrugService {
  async createDrug(drugData: CreateDrugInput): Promise<IDrug> {
    const existingDrug = await Drug.findOne({ nama: drugData.nama });
    if (existingDrug) {
      throw new AppError('Drug with this name already exists', 409);
    }
    const newDrug = await Drug.create(drugData);
    return newDrug;
  }

  async getAllDrugs(): Promise<IDrug[]> {
    return Drug.find();
  }

  async getDrugById(drugId: string): Promise<IDrug | null> {
    if (!Types.ObjectId.isValid(drugId)) {
      throw new AppError('Invalid Drug ID', 400);
    }
    const drug = await Drug.findById(drugId);
    if (!drug) {
      throw new AppError('Drug not found', 404);
    }
    return drug;
  }

  async updateDrug(drugId: string, drugData: UpdateDrugInput): Promise<IDrug | null> {
    if (!Types.ObjectId.isValid(drugId)) {
      throw new AppError('Invalid Drug ID', 400);
    }
    const drug = await Drug.findByIdAndUpdate(drugId, drugData, { new: true, runValidators: true });
    if (!drug) {
      throw new AppError('Drug not found', 404);
    }
    return drug;
  }

  async deleteDrug(drugId: string): Promise<void> {
    if (!Types.ObjectId.isValid(drugId)) {
      throw new AppError('Invalid Drug ID', 400);
    }
    const drug = await Drug.findByIdAndDelete(drugId);
    if (!drug) {
      throw new AppError('Drug not found', 404);
    }
  }
}

export default new DrugService();
