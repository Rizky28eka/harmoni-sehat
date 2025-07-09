import DrugOrderDetail, { IDrugOrderDetail } from '../../models/DrugOrderDetail';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDrugOrderDetailInput, UpdateDrugOrderDetailInput } from './drugOrderDetail.validation';
import DrugOrder from '../../models/DrugOrder';

class DrugOrderDetailService {
  async createDrugOrderDetail(drugOrderDetailData: CreateDrugOrderDetailInput): Promise<IDrugOrderDetail> {
    // Basic validation for order_id and drug_id existence
    if (!Types.ObjectId.isValid(drugOrderDetailData.order_id)) {
      throw new AppError('Invalid Order ID', 400);
    }
    if (!Types.ObjectId.isValid(drugOrderDetailData.drug_id)) {
      throw new AppError('Invalid Drug ID', 400);
    }

    const newDrugOrderDetail = await DrugOrderDetail.create(drugOrderDetailData);
    return newDrugOrderDetail;
  }

  async getAllDrugOrderDetails(): Promise<IDrugOrderDetail[]> {
    return DrugOrderDetail.find().populate('order_id').populate('drug_id');
  }

  async getDrugOrderDetailById(drugOrderDetailId: string): Promise<IDrugOrderDetail | null> {
    if (!Types.ObjectId.isValid(drugOrderDetailId)) {
      throw new AppError('Invalid Drug Order Detail ID', 400);
    }
    const drugOrderDetail = await DrugOrderDetail.findById(drugOrderDetailId).populate('order_id').populate('drug_id');
    if (!drugOrderDetail) {
      throw new AppError('Drug Order Detail not found', 404);
    }
    return drugOrderDetail;
  }

  async getDrugDetailsByOrderId(orderId: string): Promise<IDrugOrderDetail[]> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid Order ID', 400);
    }
    return DrugOrderDetail.find({ order_id: orderId }).populate('drug_id');
  }

  async updateDrugOrderDetail(drugOrderDetailId: string, drugOrderDetailData: UpdateDrugOrderDetailInput): Promise<IDrugOrderDetail | null> {
    if (!Types.ObjectId.isValid(drugOrderDetailId)) {
      throw new AppError('Invalid Drug Order Detail ID', 400);
    }
    const drugOrderDetail = await DrugOrderDetail.findByIdAndUpdate(drugOrderDetailId, drugOrderDetailData, { new: true, runValidators: true });
    if (!drugOrderDetail) {
      throw new AppError('Drug Order Detail not found', 404);
    }
    return drugOrderDetail;
  }

  async deleteDrugOrderDetail(drugOrderDetailId: string): Promise<void> {
    if (!Types.ObjectId.isValid(drugOrderDetailId)) {
      throw new AppError('Invalid Drug Order Detail ID', 400);
    }
    const drugOrderDetail = await DrugOrderDetail.findByIdAndDelete(drugOrderDetailId);
    if (!drugOrderDetail) {
      throw new AppError('Drug Order Detail not found', 404);
    }
  }
}

export default new DrugOrderDetailService();
