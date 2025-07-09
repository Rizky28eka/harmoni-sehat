import DrugOrder, { IDrugOrder } from '../../models/DrugOrder';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDrugOrderInput, UpdateDrugOrderInput } from './drugOrder.validation';
import Patient from '../../models/Patient';

class DrugOrderService {
  async createDrugOrder(userId: string, drugOrderData: CreateDrugOrderInput): Promise<IDrugOrder> {
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }

    const newDrugOrder = await DrugOrder.create({ ...drugOrderData, patient_id: patient._id });
    return newDrugOrder;
  }

  async getAllDrugOrders(): Promise<IDrugOrder[]> {
    return DrugOrder.find().populate('patient_id');
  }

  async getDrugOrderById(drugOrderId: string): Promise<IDrugOrder | null> {
    if (!Types.ObjectId.isValid(drugOrderId)) {
      throw new AppError('Invalid Drug Order ID', 400);
    }
    const drugOrder = await DrugOrder.findById(drugOrderId).populate('patient_id');
    if (!drugOrder) {
      throw new AppError('Drug Order not found', 404);
    }
    return drugOrder;
  }

  async getMyDrugOrders(userId: string): Promise<IDrugOrder[]> {
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      throw new AppError('Patient profile not found for this user', 404);
    }
    return DrugOrder.find({ patient_id: patient._id }).populate('patient_id');
  }

  async updateDrugOrder(drugOrderId: string, drugOrderData: UpdateDrugOrderInput): Promise<IDrugOrder | null> {
    if (!Types.ObjectId.isValid(drugOrderId)) {
      throw new AppError('Invalid Drug Order ID', 400);
    }
    const drugOrder = await DrugOrder.findByIdAndUpdate(drugOrderId, drugOrderData, { new: true, runValidators: true });
    if (!drugOrder) {
      throw new AppError('Drug Order not found', 404);
    }
    return drugOrder;
  }

  async deleteDrugOrder(drugOrderId: string): Promise<void> {
    if (!Types.ObjectId.isValid(drugOrderId)) {
      throw new AppError('Invalid Drug Order ID', 400);
    }
    const drugOrder = await DrugOrder.findByIdAndDelete(drugOrderId);
    if (!drugOrder) {
      throw new AppError('Drug Order not found', 404);
    }
  }
}

export default new DrugOrderService();
