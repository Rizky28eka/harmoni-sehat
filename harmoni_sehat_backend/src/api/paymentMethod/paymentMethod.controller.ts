import { Request, Response, NextFunction } from 'express';
import PaymentMethodService from './paymentMethod.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPaymentMethodResponseDto } from './paymentMethod.interface';
import { CreatePaymentMethodInput, UpdatePaymentMethodInput } from './paymentMethod.validation';

class PaymentMethodController {
  async createPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethodData: CreatePaymentMethodInput = req.body;
      const newPaymentMethod = await PaymentMethodService.createPaymentMethod(paymentMethodData);
      res.status(201).json(new ApiResponse(201, toPaymentMethodResponseDto(newPaymentMethod), 'Payment method created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethods = await PaymentMethodService.getAllPaymentMethods();
      res.status(200).json(new ApiResponse(200, paymentMethods.map(toPaymentMethodResponseDto), 'Payment methods fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPaymentMethodById(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethod = await PaymentMethodService.getPaymentMethodById(req.params.id);
      res.status(200).json(new ApiResponse(200, toPaymentMethodResponseDto(paymentMethod!), 'Payment method fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethodData: UpdatePaymentMethodInput = req.body;
      const paymentMethodId = req.params.id;
      const updatedPaymentMethod = await PaymentMethodService.updatePaymentMethod(paymentMethodId, paymentMethodData);
      res.status(200).json(new ApiResponse(200, toPaymentMethodResponseDto(updatedPaymentMethod!), 'Payment method updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethodId = req.params.id;
      await PaymentMethodService.deletePaymentMethod(paymentMethodId);
      res.status(204).json(new ApiResponse(204, null, 'Payment method deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentMethodController();
