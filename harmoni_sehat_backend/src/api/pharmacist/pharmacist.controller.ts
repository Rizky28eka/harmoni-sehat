import { Request, Response, NextFunction } from 'express';
import PharmacistService from './pharmacist.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPharmacistResponseDto } from './pharmacist.interface';
import { CreatePharmacistInput, UpdatePharmacistInput } from './pharmacist.validation';

class PharmacistController {
  async createPharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacistData: CreatePharmacistInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newPharmacist = await PharmacistService.createPharmacist(userId.toString(), pharmacistData);
      res.status(201).json(new ApiResponse(201, toPharmacistResponseDto(newPharmacist), 'Pharmacist created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPharmacists(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacists = await PharmacistService.getAllPharmacists();
      res.status(200).json(new ApiResponse(200, pharmacists.map(toPharmacistResponseDto), 'Pharmacists fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPharmacistById(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacist = await PharmacistService.getPharmacistById(req.params.id);

      // Ownership authorization: Pharmacist can only access their own profile
      if (req.user?.roles?.includes('pharmacist') && pharmacist?.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this pharmacist profile.', 403));
      }

      res.status(200).json(new ApiResponse(200, toPharmacistResponseDto(pharmacist!), 'Pharmacist fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyPharmacistProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const pharmacist = await PharmacistService.getMyPharmacistProfile(userId.toString());
      res.status(200).json(new ApiResponse(200, toPharmacistResponseDto(pharmacist!), 'My pharmacist profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacistData: UpdatePharmacistInput = req.body;
      const pharmacistId = req.params.id; // ID of the pharmacist to update

      // Get the pharmacist first to check ownership
      const existingPharmacist = await PharmacistService.getPharmacistById(pharmacistId);
      if (!existingPharmacist) {
        return next(new AppError('Pharmacist not found', 404));
      }

      // Ownership authorization: Pharmacist can only update their own profile
      if (req.user?.roles?.includes('pharmacist') && existingPharmacist.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this pharmacist profile.', 403));
      }

      const updatedPharmacist = await PharmacistService.updatePharmacist(pharmacistId, pharmacistData);
      res.status(200).json(new ApiResponse(200, toPharmacistResponseDto(updatedPharmacist!), 'Pharmacist updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePharmacist(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacistId = req.params.id; // ID of the pharmacist to delete

      // Get the pharmacist first to check ownership
      const existingPharmacist = await PharmacistService.getPharmacistById(pharmacistId);
      if (!existingPharmacist) {
        return next(new AppError('Pharmacist not found', 404));
      }

      // Ownership authorization: Pharmacist can only delete their own profile
      if (req.user?.roles?.includes('pharmacist') && existingPharmacist.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this pharmacist profile.', 403));
      }

      await PharmacistService.deletePharmacist(pharmacistId);
      res.status(204).json(new ApiResponse(204, null, 'Pharmacist deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PharmacistController();
