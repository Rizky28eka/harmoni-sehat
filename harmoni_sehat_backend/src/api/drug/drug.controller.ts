import { Request, Response, NextFunction } from 'express';
import DrugService from './drug.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDrugResponseDto } from './drug.interface';
import { CreateDrugInput, UpdateDrugInput } from './drug.validation';

class DrugController {
  async createDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const drugData: CreateDrugInput = req.body;
      const newDrug = await DrugService.createDrug(drugData);
      res.status(201).json(new ApiResponse(201, toDrugResponseDto(newDrug), 'Drug created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDrugs(req: Request, res: Response, next: NextFunction) {
    try {
      const drugs = await DrugService.getAllDrugs();
      res.status(200).json(new ApiResponse(200, drugs.map(toDrugResponseDto), 'Drugs fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDrugById(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await DrugService.getDrugById(req.params.id);
      res.status(200).json(new ApiResponse(200, toDrugResponseDto(drug!), 'Drug fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const drugData: UpdateDrugInput = req.body;
      const drugId = req.params.id;
      const updatedDrug = await DrugService.updateDrug(drugId, drugData);
      res.status(200).json(new ApiResponse(200, toDrugResponseDto(updatedDrug!), 'Drug updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const drugId = req.params.id;
      await DrugService.deleteDrug(drugId);
      res.status(204).json(new ApiResponse(204, null, 'Drug deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DrugController();
