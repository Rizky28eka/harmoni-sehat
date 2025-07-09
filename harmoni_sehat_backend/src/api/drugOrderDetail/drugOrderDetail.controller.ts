import { Request, Response, NextFunction } from 'express';
import DrugOrderDetailService from './drugOrderDetail.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDrugOrderDetailResponseDto } from './drugOrderDetail.interface';
import { CreateDrugOrderDetailInput, UpdateDrugOrderDetailInput } from './drugOrderDetail.validation';
import DrugOrder from '../../models/DrugOrder';

class DrugOrderDetailController {
  async createDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetailData: CreateDrugOrderDetailInput = req.body;
      const newDrugOrderDetail = await DrugOrderDetailService.createDrugOrderDetail(drugOrderDetailData);
      res.status(201).json(new ApiResponse(201, toDrugOrderDetailResponseDto(newDrugOrderDetail), 'Drug order detail created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDrugOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetails = await DrugOrderDetailService.getAllDrugOrderDetails();
      res.status(200).json(new ApiResponse(200, drugOrderDetails.map(toDrugOrderDetailResponseDto), 'Drug order details fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDrugOrderDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetail = await DrugOrderDetailService.getDrugOrderDetailById(req.params.id);

      // Ownership authorization: Check if the logged-in user owns the parent DrugOrder
      if (req.user?.roles?.includes('patient')) {
        const order = await DrugOrder.findById(drugOrderDetail?.order_id);
        if (!order || order.patient_id.toString() !== req.user._id.toString()) {
          return next(new AppError('You are not authorized to access this drug order detail.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toDrugOrderDetailResponseDto(drugOrderDetail!), 'Drug order detail fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDrugDetailsByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;

      // Ownership authorization: Check if the logged-in user owns the parent DrugOrder
      if (req.user?.roles?.includes('patient')) {
        const order = await DrugOrder.findById(orderId);
        if (!order || order.patient_id.toString() !== req.user._id.toString()) {
          return next(new AppError('You are not authorized to access details for this order.', 403));
        }
      }

      const drugOrderDetails = await DrugOrderDetailService.getDrugDetailsByOrderId(orderId);
      res.status(200).json(new ApiResponse(200, drugOrderDetails.map(toDrugOrderDetailResponseDto), 'Drug details for order fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetailData: UpdateDrugOrderDetailInput = req.body;
      const drugOrderDetailId = req.params.id; // ID of the drug order detail to update

      // Get the drug order detail first to check ownership
      const existingDrugOrderDetail = await DrugOrderDetailService.getDrugOrderDetailById(drugOrderDetailId);
      if (!existingDrugOrderDetail) {
        return next(new AppError('Drug Order Detail not found', 404));
      }

      // Ownership authorization: Check if the logged-in user owns the parent DrugOrder
      if (req.user?.roles?.includes('patient')) {
        const order = await DrugOrder.findById(existingDrugOrderDetail.order_id);
        if (!order || order.patient_id.toString() !== req.user._id.toString()) {
          return next(new AppError('You are not authorized to update this drug order detail.', 403));
        }
      }

      const updatedDrugOrderDetail = await DrugOrderDetailService.updateDrugOrderDetail(drugOrderDetailId, drugOrderDetailData);
      res.status(200).json(new ApiResponse(200, toDrugOrderDetailResponseDto(updatedDrugOrderDetail!), 'Drug order detail updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetailId = req.params.id; // ID of the drug order detail to delete

      // Get the drug order detail first to check ownership
      const existingDrugOrderDetail = await DrugOrderDetailService.getDrugOrderDetailById(drugOrderDetailId);
      if (!existingDrugOrderDetail) {
        return next(new AppError('Drug Order Detail not found', 404));
      }

      // Ownership authorization: Check if the logged-in user owns the parent DrugOrder
      if (req.user?.roles?.includes('patient')) {
        const order = await DrugOrder.findById(existingDrugOrderDetail.order_id);
        if (!order || order.patient_id.toString() !== req.user._id.toString()) {
          return next(new AppError('You are not authorized to delete this drug order detail.', 403));
        }
      }

      await DrugOrderDetailService.deleteDrugOrderDetail(drugOrderDetailId);
      res.status(204).json(new ApiResponse(204, null, 'Drug order detail deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DrugOrderDetailController();
