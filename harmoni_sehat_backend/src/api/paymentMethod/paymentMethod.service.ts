import PaymentMethod, { IPaymentMethod } from '../../models/PaymentMethod';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePaymentMethodInput, UpdatePaymentMethodInput } from './paymentMethod.validation';

class PaymentMethodService {
  async createPaymentMethod(paymentMethodData: CreatePaymentMethodInput): Promise<IPaymentMethod> {
    const existingPaymentMethod = await PaymentMethod.findOne({ kode: paymentMethodData.kode });
    if (existingPaymentMethod) {
      throw new AppError('Payment method with this code already exists', 409);
    }
    const newPaymentMethod = await PaymentMethod.create(paymentMethodData);
    return newPaymentMethod;
  }

  async getAllPaymentMethods(): Promise<IPaymentMethod[]> {
    return PaymentMethod.find();
  }

  async getPaymentMethodById(paymentMethodId: string): Promise<IPaymentMethod | null> {
    if (!Types.ObjectId.isValid(paymentMethodId)) {
      throw new AppError('Invalid Payment Method ID', 400);
    }
    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      throw new AppError('Payment Method not found', 404);
    }
    return paymentMethod;
  }

  async updatePaymentMethod(paymentMethodId: string, paymentMethodData: UpdatePaymentMethodInput): Promise<IPaymentMethod | null> {
    if (!Types.ObjectId.isValid(paymentMethodId)) {
      throw new AppError('Invalid Payment Method ID', 400);
    }
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(paymentMethodId, paymentMethodData, { new: true, runValidators: true });
    if (!paymentMethod) {
      throw new AppError('Payment Method not found', 404);
    }
    return paymentMethod;
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    if (!Types.ObjectId.isValid(paymentMethodId)) {
      throw new AppError('Invalid Payment Method ID', 400);
    }
    const paymentMethod = await PaymentMethod.findByIdAndDelete(paymentMethodId);
    if (!paymentMethod) {
      throw new AppError('Payment Method not found', 404);
    }
  }
}

export default new PaymentMethodService();
