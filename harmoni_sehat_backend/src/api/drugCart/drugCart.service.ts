import DrugCart, { IDrugCart } from '../../models/DrugCart';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDrugCartInput, UpdateDrugCartInput } from './drugCart.validation';
import Patient from '../../models/Patient';

class DrugCartService {
  async createDrugCart(userId: string, drugCartData: CreateDrugCartInput): Promise<IDrugCart> {
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }

    // Check if item already exists in cart for this patient
    const existingCartItem = await DrugCart.findOne({ patient_id: patient._id, drug_id: drugCartData.drug_id });
    if (existingCartItem) {
      // If exists, update quantity instead of creating new
      existingCartItem.jumlah += drugCartData.jumlah;
      return existingCartItem.save();
    }

    const newDrugCart = await DrugCart.create({ ...drugCartData, patient_id: patient._id });
    return newDrugCart;
  }

  async getMyDrugCart(userId: string): Promise<IDrugCart[]> {
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }
    return DrugCart.find({ patient_id: patient._id }).populate('drug_id');
  }

  async getDrugCartById(drugCartId: string): Promise<IDrugCart | null> {
    if (!Types.ObjectId.isValid(drugCartId)) {
      throw new AppError('Invalid Drug Cart ID', 400);
    }
    const drugCart = await DrugCart.findById(drugCartId).populate('drug_id').populate('patient_id');
    if (!drugCart) {
      throw new AppError('Drug Cart item not found', 404);
    }
    return drugCart;
  }

  async updateDrugCart(drugCartId: string, drugCartData: UpdateDrugCartInput): Promise<IDrugCart | null> {
    if (!Types.ObjectId.isValid(drugCartId)) {
      throw new AppError('Invalid Drug Cart ID', 400);
    }
    const drugCart = await DrugCart.findByIdAndUpdate(drugCartId, drugCartData, { new: true, runValidators: true });
    if (!drugCart) {
      throw new AppError('Drug Cart item not found', 404);
    }
    return drugCart;
  }

  async deleteDrugCart(drugCartId: string): Promise<void> {
    if (!Types.ObjectId.isValid(drugCartId)) {
      throw new AppError('Invalid Drug Cart ID', 400);
    }
    const drugCart = await DrugCart.findByIdAndDelete(drugCartId);
    if (!drugCart) {
      throw new AppError('Drug Cart item not found', 404);
    }
  }

  async clearMyDrugCart(userId: string): Promise<void> {
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }
    await DrugCart.deleteMany({ patient_id: patient._id });
  }
}

export default new DrugCartService();
