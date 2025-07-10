import DrugCart, { IDrugCart } from '../../models/DrugCart';
import { AppError } from '../../utils/AppError';

class DrugCartService {
  async createDrugCart(data: Partial<IDrugCart>): Promise<IDrugCart> {
    const drugCart = await DrugCart.create(data);
    return drugCart;
  }

  async getAllDrugCarts(): Promise<IDrugCart[]> {
    const drugCarts = await DrugCart.find().populate('pasien_id').populate('obat_id');
    return drugCarts;
  }

  async getDrugCartById(id: string): Promise<IDrugCart> {
    const drugCart = await DrugCart.findById(id).populate('pasien_id').populate('obat_id');
    if (!drugCart) {
      throw new AppError('Keranjang obat tidak ditemukan', 404);
    }
    return drugCart;
  }

  async updateDrugCart(id: string, data: Partial<IDrugCart>): Promise<IDrugCart> {
    const drugCart = await DrugCart.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!drugCart) {
      throw new AppError('Keranjang obat tidak ditemukan', 404);
    }
    return drugCart;
  }

  async deleteDrugCart(id: string): Promise<void> {
    const drugCart = await DrugCart.findByIdAndDelete(id);
    if (!drugCart) {
      throw new AppError('Keranjang obat tidak ditemukan', 404);
    }
  }
}

export default new DrugCartService();