import { Request, Response, NextFunction } from 'express';
import drugCartService from './drugCart.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class DrugCartController {
  async createDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCart = await drugCartService.createDrugCart(req.body);
      res.status(201).json(new ApiResponse(201, drugCart, 'Keranjang obat berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllDrugCarts(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCarts = await drugCartService.getAllDrugCarts();
      res.status(200).json(new ApiResponse(200, drugCarts, 'Daftar keranjang obat berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getDrugCartById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCart = await drugCartService.getDrugCartById(req.params.id);
      res.status(200).json(new ApiResponse(200, drugCart, 'Keranjang obat berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCart = await drugCartService.updateDrugCart(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, drugCart, 'Keranjang obat berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      await drugCartService.deleteDrugCart(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Keranjang obat berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new DrugCartController();