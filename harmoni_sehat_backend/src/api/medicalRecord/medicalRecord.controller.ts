import { Request, Response, NextFunction } from 'express';
import MedicalRecordService from './medicalRecord.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto, toMedicalRecordResponseDto } from './medicalRecord.interface';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';

class MedicalRecordController {
  async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await MedicalRecordService.getAllMedicalRecords();
      res.status(200).json(new ApiResponse(200, records.map(toMedicalRecordResponseDto), 'Medical records fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await MedicalRecordService.getMedicalRecordById(req.params.id);
      res.status(200).json(new ApiResponse(200, toMedicalRecordResponseDto(record!), 'Medical record fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const recordData: CreateMedicalRecordDto = req.body;
      const newRecord = await MedicalRecordService.createMedicalRecord(recordData);
      res.status(201).json(new ApiResponse(201, toMedicalRecordResponseDto(newRecord), 'Medical record created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const recordData: UpdateMedicalRecordDto = req.body;
      const updatedRecord = await MedicalRecordService.updateMedicalRecord(req.params.id, recordData);
      res.status(200).json(new ApiResponse(200, toMedicalRecordResponseDto(updatedRecord!), 'Medical record updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      await MedicalRecordService.deleteMedicalRecord(req.params.id);
      res.status(204).json(new ApiResponse(204, null, 'Medical record deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new MedicalRecordController();
