import { Request, Response, NextFunction } from 'express';
import TransactionService from './transaction.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toTransactionResponseDto } from './transaction.interface';
import { CreateTransactionInput, UpdateTransactionInput } from './transaction.validation';

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData: CreateTransactionInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newTransaction = await TransactionService.createTransaction(userId.toString(), transactionData);
      res.status(201).json(new ApiResponse(201, toTransactionResponseDto(newTransaction), 'Transaction created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await TransactionService.getAllTransactions();
      res.status(200).json(new ApiResponse(200, transactions.map(toTransactionResponseDto), 'Transactions fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id);

      // Ownership authorization: User can only access their own transactions
      if (req.user?._id.toString() !== transaction?.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access this transaction.', 403));
      }

      res.status(200).json(new ApiResponse(200, toTransactionResponseDto(transaction!), 'Transaction fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const transactions = await TransactionService.getMyTransactions(userId.toString());
      res.status(200).json(new ApiResponse(200, transactions.map(toTransactionResponseDto), 'My transactions fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData: UpdateTransactionInput = req.body;
      const transactionId = req.params.id; // ID of the transaction to update

      // Get the transaction first to check ownership
      const existingTransaction = await TransactionService.getTransactionById(transactionId);
      if (!existingTransaction) {
        return next(new AppError('Transaction not found', 404));
      }

      // Ownership authorization: User can only update their own transactions
      if (req.user?._id.toString() !== existingTransaction.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to update this transaction.', 403));
      }

      const updatedTransaction = await TransactionService.updateTransaction(transactionId, transactionData);
      res.status(200).json(new ApiResponse(200, toTransactionResponseDto(updatedTransaction!), 'Transaction updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = req.params.id; // ID of the transaction to delete

      // Get the transaction first to check ownership
      const existingTransaction = await TransactionService.getTransactionById(transactionId);
      if (!existingTransaction) {
        return next(new AppError('Transaction not found', 404));
      }

      // Ownership authorization: User can only delete their own transactions
      if (req.user?._id.toString() !== existingTransaction.user_id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to delete this transaction.', 403));
      }

      await TransactionService.deleteTransaction(transactionId);
      res.status(204).json(new ApiResponse(204, null, 'Transaction deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
