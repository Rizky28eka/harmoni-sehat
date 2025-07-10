import { Request, Response, NextFunction } from 'express';
import drugOrderService from './drugOrder.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DrugOrderController {
  async createDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrder = await drugOrderService.createDrugOrder(req.body);
      res.status(201).json(new ApiResponse(201, drugOrder, 'Pesanan obat berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDrugOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrders = await drugOrderService.getAllDrugOrders();
      res.status(200).json(new ApiResponse(200, drugOrders, 'Daftar pesanan obat berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDrugOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrder = await drugOrderService.getDrugOrderById(req.params.id);
      res.status(200).json(new ApiResponse(200, drugOrder, 'Pesanan obat berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrder = await drugOrderService.updateDrugOrder(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, drugOrder, 'Pesanan obat berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDrugOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await drugOrderService.deleteDrugOrder(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Pesanan obat berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DrugOrderController();