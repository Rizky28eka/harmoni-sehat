import DrugOrder, { IDrugOrder } from '../../models/DrugOrder';
import { AppError } from '../../utils/AppError';

class DrugOrderService {
  async createDrugOrder(data: Partial<IDrugOrder>): Promise<IDrugOrder> {
    const existingOrder = await DrugOrder.findOne({ kode_pesanan: data.kode_pesanan });
    if (existingOrder) {
      throw new AppError('Pesanan obat dengan kode tersebut sudah ada', 409);
    }
    const drugOrder = await DrugOrder.create(data);
    return drugOrder;
  }

  async getAllDrugOrders(): Promise<IDrugOrder[]> {
    const drugOrders = await DrugOrder.find().populate('pasien_id');
    return drugOrders;
  }

  async getDrugOrderById(id: string): Promise<IDrugOrder> {
    const drugOrder = await DrugOrder.findById(id).populate('pasien_id');
    if (!drugOrder) {
      throw new AppError('Pesanan obat tidak ditemukan', 404);
    }
    return drugOrder;
  }

  async updateDrugOrder(id: string, data: Partial<IDrugOrder>): Promise<IDrugOrder> {
    const drugOrder = await DrugOrder.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!drugOrder) {
      throw new AppError('Pesanan obat tidak ditemukan', 404);
    }
    return drugOrder;
  }

  async deleteDrugOrder(id: string): Promise<void> {
    const drugOrder = await DrugOrder.findByIdAndDelete(id);
    if (!drugOrder) {
      throw new AppError('Pesanan obat tidak ditemukan', 404);
    }
  }
}

export default new DrugOrderService();