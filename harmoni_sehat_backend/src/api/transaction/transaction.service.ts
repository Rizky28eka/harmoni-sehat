import Transaction, { ITransaction } from '../../models/Transaction';
import { AppError } from '../../utils/AppError';

class TransactionService {
  async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = await Transaction.create(data);
    return transaction;
  }

  async getAllTransactions(): Promise<ITransaction[]> {
    const transactions = await Transaction.find().populate('user_id').populate('metode_pembayaran_id');
    return transactions;
  }

  async getTransactionById(id: string): Promise<ITransaction> {
    const transaction = await Transaction.findById(id).populate('user_id').populate('metode_pembayaran_id');
    if (!transaction) {
      throw new AppError('Transaksi tidak ditemukan', 404);
    }
    return transaction;
  }

  async updateTransaction(id: string, data: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = await Transaction.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!transaction) {
      throw new AppError('Transaksi tidak ditemukan', 404);
    }
    return transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      throw new AppError('Transaksi tidak ditemukan', 404);
    }
  }
}

export default new TransactionService();