import Transaction, { ITransaction } from '../../models/Transaction';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateTransactionInput, UpdateTransactionInput } from './transaction.validation';
import User from '../../models/User';
import PaymentMethod from '../../models/PaymentMethod';
import Consultation from '../../models/Consultation';
import DrugOrder from '../../models/DrugOrder';

class TransactionService {
  async createTransaction(userId: string, transactionData: CreateTransactionInput): Promise<ITransaction> {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if payment method exists
    const paymentMethod = await PaymentMethod.findById(transactionData.payment_method_id);
    if (!paymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    // Check if transaksiable_id and transaksiable_type are valid
    if (transactionData.transaksiable_type === 'Consultation') {
      const consultation = await Consultation.findById(transactionData.transaksiable_id);
      if (!consultation) {
        throw new AppError('Consultation not found', 404);
      }
    } else if (transactionData.transaksiable_type === 'DrugOrder') {
      const drugOrder = await DrugOrder.findById(transactionData.transaksiable_id);
      if (!drugOrder) {
        throw new AppError('Drug Order not found', 404);
      }
    } else {
      throw new AppError('Invalid transaksiable type', 400);
    }

    const newTransaction = await Transaction.create({ ...transactionData, user_id: userId });
    return newTransaction;
  }

  async getAllTransactions(): Promise<ITransaction[]> {
    return Transaction.find().populate('user_id').populate('payment_method_id');
  }

  async getTransactionById(transactionId: string): Promise<ITransaction | null> {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new AppError('Invalid Transaction ID', 400);
    }
    const transaction = await Transaction.findById(transactionId).populate('user_id').populate('payment_method_id');
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return transaction;
  }

  async getMyTransactions(userId: string): Promise<ITransaction[]> {
    return Transaction.find({ user_id: userId }).populate('user_id').populate('payment_method_id');
  }

  async updateTransaction(transactionId: string, transactionData: UpdateTransactionInput): Promise<ITransaction | null> {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new AppError('Invalid Transaction ID', 400);
    }
    const transaction = await Transaction.findByIdAndUpdate(transactionId, transactionData, { new: true, runValidators: true });
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return transaction;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new AppError('Invalid Transaction ID', 400);
    }
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
  }
}

export default new TransactionService();
