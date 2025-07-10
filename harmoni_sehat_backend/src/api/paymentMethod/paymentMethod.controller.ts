import { Request, Response, NextFunction } from 'express';
import paymentMethodService from './paymentMethod.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PaymentMethodController {
  async createPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethod = await paymentMethodService.createPaymentMethod(req.body);
      res.status(201).json(new ApiResponse(201, paymentMethod, 'Metode pembayaran berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethods = await paymentMethodService.getAllPaymentMethods();
      res.status(200).json(new ApiResponse(200, paymentMethods, 'Daftar metode pembayaran berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPaymentMethodById(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethod = await paymentMethodService.getPaymentMethodById(req.params.id);
      res.status(200).json(new ApiResponse(200, paymentMethod, 'Metode pembayaran berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethod = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, paymentMethod, 'Metode pembayaran berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      await paymentMethodService.deletePaymentMethod(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Metode pembayaran berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PaymentMethodController();