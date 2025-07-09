import { Request, Response, NextFunction } from 'express';
import SpecializationService from './specialization.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toSpecializationResponseDto } from './specialization.interface';
import { CreateSpecializationInput, UpdateSpecializationInput } from './specialization.validation';

class SpecializationController {
  async createSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const specializationData: CreateSpecializationInput = req.body;
      const newSpecialization = await SpecializationService.createSpecialization(specializationData);
      res.status(201).json(new ApiResponse(201, toSpecializationResponseDto(newSpecialization), 'Specialization created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllSpecializations(req: Request, res: Response, next: NextFunction) {
    try {
      const specializations = await SpecializationService.getAllSpecializations();
      res.status(200).json(new ApiResponse(200, specializations.map(toSpecializationResponseDto), 'Specializations fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getSpecializationById(req: Request, res: Response, next: NextFunction) {
    try {
      const specialization = await SpecializationService.getSpecializationById(req.params.id);
      res.status(200).json(new ApiResponse(200, toSpecializationResponseDto(specialization!), 'Specialization fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const specializationData: UpdateSpecializationInput = req.body;
      const specializationId = req.params.id;
      const updatedSpecialization = await SpecializationService.updateSpecialization(specializationId, specializationData);
      res.status(200).json(new ApiResponse(200, toSpecializationResponseDto(updatedSpecialization!), 'Specialization updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const specializationId = req.params.id;
      await SpecializationService.deleteSpecialization(specializationId);
      res.status(204).json(new ApiResponse(204, null, 'Specialization deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new SpecializationController();
