import { Request, Response, NextFunction } from 'express';
import ClinicService from './clinic.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toClinicResponseDto } from './clinic.interface';
import { CreateClinicInput, UpdateClinicInput } from './clinic.validation';

class ClinicController {
  async createClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicData: CreateClinicInput = req.body;
      const newClinic = await ClinicService.createClinic(clinicData);
      res.status(201).json(new ApiResponse(201, toClinicResponseDto(newClinic), 'Clinic created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllClinics(req: Request, res: Response, next: NextFunction) {
    try {
      const clinics = await ClinicService.getAllClinics();
      res.status(200).json(new ApiResponse(200, clinics.map(toClinicResponseDto), 'Clinics fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getClinicById(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await ClinicService.getClinicById(req.params.id);
      res.status(200).json(new ApiResponse(200, toClinicResponseDto(clinic!), 'Clinic fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicData: UpdateClinicInput = req.body;
      const clinicId = req.params.id;
      const updatedClinic = await ClinicService.updateClinic(clinicId, clinicData);
      res.status(200).json(new ApiResponse(200, toClinicResponseDto(updatedClinic!), 'Clinic updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicId = req.params.id;
      await ClinicService.deleteClinic(clinicId);
      res.status(204).json(new ApiResponse(204, null, 'Clinic deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ClinicController();
