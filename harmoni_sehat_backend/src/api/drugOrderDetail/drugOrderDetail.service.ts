import DrugOrderDetail, { IDrugOrderDetail } from '../../models/DrugOrderDetail';
import { AppError } from '../../utils/AppError';

class DrugOrderDetailService {
  async createDrugOrderDetail(data: Partial<IDrugOrderDetail>): Promise<IDrugOrderDetail> {
    const drugOrderDetail = await DrugOrderDetail.create(data);
    return drugOrderDetail;
  }

  async getAllDrugOrderDetails(): Promise<IDrugOrderDetail[]> {
    const drugOrderDetails = await DrugOrderDetail.find().populate('pesanan_id').populate('obat_id');
    return drugOrderDetails;
  }

  async getDrugOrderDetailById(id: string): Promise<IDrugOrderDetail> {
    const drugOrderDetail = await DrugOrderDetail.findById(id).populate('pesanan_id').populate('obat_id');
    if (!drugOrderDetail) {
      throw new AppError('Detail pesanan obat tidak ditemukan', 404);
    }
    return drugOrderDetail;
  }

  async updateDrugOrderDetail(id: string, data: Partial<IDrugOrderDetail>): Promise<IDrugOrderDetail> {
    const drugOrderDetail = await DrugOrderDetail.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!drugOrderDetail) {
      throw new AppError('Detail pesanan obat tidak ditemukan', 404);
    }
    return drugOrderDetail;
  }

  async deleteDrugOrderDetail(id: string): Promise<void> {
    const drugOrderDetail = await DrugOrderDetail.findByIdAndDelete(id);
    if (!drugOrderDetail) {
      throw new AppError('Detail pesanan obat tidak ditemukan', 404);
    }
  }
}

export default new DrugOrderDetailService();