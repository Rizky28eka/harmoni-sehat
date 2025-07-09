import { Request, Response, NextFunction } from 'express';
import DrugCartService from './drugCart.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDrugCartResponseDto } from './drugCart.interface';
import { CreateDrugCartInput, UpdateDrugCartInput } from './drugCart.validation';

class DrugCartController {
  async createDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCartData: CreateDrugCartInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newDrugCart = await DrugCartService.createDrugCart(userId.toString(), drugCartData);
      res.status(201).json(new ApiResponse(201, toDrugCartResponseDto(newDrugCart), 'Drug added to cart successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const drugCarts = await DrugCartService.getMyDrugCart(userId.toString());
      res.status(200).json(new ApiResponse(200, drugCarts.map(toDrugCartResponseDto), 'Drug cart fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDrugCartById(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCart = await DrugCartService.getDrugCartById(req.params.id);

      // Ownership authorization: Patient can only access their own cart item
      if (req.user?.roles?.includes('patient') && drugCart?.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this drug cart item.', 403));
      }

      res.status(200).json(new ApiResponse(200, toDrugCartResponseDto(drugCart!), 'Drug cart item fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCartData: UpdateDrugCartInput = req.body;
      const drugCartId = req.params.id; // ID of the drug cart item to update

      // Get the drug cart item first to check ownership
      const existingDrugCart = await DrugCartService.getDrugCartById(drugCartId);
      if (!existingDrugCart) {
        return next(new AppError('Drug Cart item not found', 404));
      }

      // Ownership authorization: Patient can only update their own cart item
      if (req.user?.roles?.includes('patient') && existingDrugCart.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this drug cart item.', 403));
      }

      const updatedDrugCart = await DrugCartService.updateDrugCart(drugCartId, drugCartData);
      res.status(200).json(new ApiResponse(200, toDrugCartResponseDto(updatedDrugCart!), 'Drug cart item updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const drugCartId = req.params.id; // ID of the drug cart item to delete

      // Get the drug cart item first to check ownership
      const existingDrugCart = await DrugCartService.getDrugCartById(drugCartId);
      if (!existingDrugCart) {
        return next(new AppError('Drug Cart item not found', 404));
      }

      // Ownership authorization: Patient can only delete their own cart item
      if (req.user?.roles?.includes('patient') && existingDrugCart.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this drug cart item.', 403));
      }

      await DrugCartService.deleteDrugCart(drugCartId);
      res.status(204).json(new ApiResponse(204, null, 'Drug cart item deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async clearMyDrugCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      await DrugCartService.clearMyDrugCart(userId.toString());
      res.status(204).json(new ApiResponse(204, null, 'Drug cart cleared successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DrugCartController();
