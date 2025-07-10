import { Request, Response, NextFunction } from 'express';
import drugOrderDetailService from './drugOrderDetail.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DrugOrderDetailController {
  async createDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetail = await drugOrderDetailService.createDrugOrderDetail(req.body);
      res.status(201).json(new ApiResponse(201, drugOrderDetail, 'Detail pesanan obat berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDrugOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetails = await drugOrderDetailService.getAllDrugOrderDetails();
      res.status(200).json(new ApiResponse(200, drugOrderDetails, 'Daftar detail pesanan obat berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDrugOrderDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetail = await drugOrderDetailService.getDrugOrderDetailById(req.params.id);
      res.status(200).json(new ApiResponse(200, drugOrderDetail, 'Detail pesanan obat berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const drugOrderDetail = await drugOrderDetailService.updateDrugOrderDetail(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, drugOrderDetail, 'Detail pesanan obat berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDrugOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      await drugOrderDetailService.deleteDrugOrderDetail(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Detail pesanan obat berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DrugOrderDetailController();