import PaymentMethod, { IPaymentMethod } from '../../models/PaymentMethod';
import { AppError } from '../../utils/AppError';

class PaymentMethodService {
  async createPaymentMethod(data: Partial<IPaymentMethod>): Promise<IPaymentMethod> {
    const existingPaymentMethod = await PaymentMethod.findOne({ kode: data.kode });
    if (existingPaymentMethod) {
      throw new AppError('Metode pembayaran dengan kode tersebut sudah ada', 409);
    }
    const paymentMethod = await PaymentMethod.create(data);
    return paymentMethod;
  }

  async getAllPaymentMethods(): Promise<IPaymentMethod[]> {
    const paymentMethods = await PaymentMethod.find();
    return paymentMethods;
  }

  async getPaymentMethodById(id: string): Promise<IPaymentMethod> {
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      throw new AppError('Metode pembayaran tidak ditemukan', 404);
    }
    return paymentMethod;
  }

  async updatePaymentMethod(id: string, data: Partial<IPaymentMethod>): Promise<IPaymentMethod> {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!paymentMethod) {
      throw new AppError('Metode pembayaran tidak ditemukan', 404);
    }
    return paymentMethod;
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
    if (!paymentMethod) {
      throw new AppError('Metode pembayaran tidak ditemukan', 404);
    }
  }
}

export default new PaymentMethodService();