import { Request, Response, NextFunction } from 'express';
import DrugOrderService from './drugOrder.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDrugOrderResponseDto } from './drugOrder.interface';
import { CreateDrugOrderInput, UpdateDrugOrderInput } from './drugOrder.validation';

class DrugOrderController {
  async createDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderData: CreateDrugOrderInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newDrugOrder = await DrugOrderService.createDrugOrder(userId.toString(), drugOrderData);
      res.status(201).json(new ApiResponse(201, toDrugOrderResponseDto(newDrugOrder), 'Drug order created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDrugOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrders = await DrugOrderService.getAllDrugOrders();
      res.status(200).json(new ApiResponse(200, drugOrders.map(toDrugOrderResponseDto), 'Drug orders fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDrugOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrder = await DrugOrderService.getDrugOrderById(req.params.id);

      // Ownership authorization: Patient can only access their own order
      if (req.user?.roles?.includes('patient') && drugOrder?.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this drug order.', 403));
      }

      res.status(200).json(new ApiResponse(200, toDrugOrderResponseDto(drugOrder!), 'Drug order fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyDrugOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const drugOrders = await DrugOrderService.getMyDrugOrders(userId.toString());
      res.status(200).json(new ApiResponse(200, drugOrders.map(toDrugOrderResponseDto), 'My drug orders fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderData: UpdateDrugOrderInput = req.body;
      const drugOrderId = req.params.id; // ID of the drug order to update

      // Get the drug order first to check ownership
      const existingDrugOrder = await DrugOrderService.getDrugOrderById(drugOrderId);
      if (!existingDrugOrder) {
        return next(new AppError('Drug Order not found', 404));
      }

      // Ownership authorization: Patient can only update their own order
      if (req.user?.roles?.includes('patient') && existingDrugOrder.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this drug order.', 403));
      }

      const updatedDrugOrder = await DrugOrderService.updateDrugOrder(drugOrderId, drugOrderData);
      res.status(200).json(new ApiResponse(200, toDrugOrderResponseDto(updatedDrugOrder!), 'Drug order updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderId = req.params.id; // ID of the drug order to delete

      // Get the drug order first to check ownership
      const existingDrugOrder = await DrugOrderService.getDrugOrderById(drugOrderId);
      if (!existingDrugOrder) {
        return next(new AppError('Drug Order not found', 404));
      }

      // Ownership authorization: Patient can only delete their own order
      if (req.user?.roles?.includes('patient') && existingDrugOrder.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this drug order.', 403));
      }

      await DrugOrderService.deleteDrugOrder(drugOrderId);
      res.status(204).json(new ApiResponse(204, null, 'Drug order deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DrugOrderController();
