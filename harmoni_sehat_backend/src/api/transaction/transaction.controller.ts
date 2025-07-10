import { Request, Response, NextFunction } from 'express';
import transactionService from './transaction.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(new ApiResponse(201, transaction, 'Transaksi berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.status(200).json(new ApiResponse(200, transactions, 'Daftar transaksi berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);
      res.status(200).json(new ApiResponse(200, transaction, 'Transaksi berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.updateTransaction(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, transaction, 'Transaksi berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionService.deleteTransaction(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Transaksi berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new TransactionController();