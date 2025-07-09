import { Request, Response, NextFunction } from 'express';
import MedicalRecordService from './medicalRecord.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toMedicalRecordResponseDto } from './medicalRecord.interface';
import { CreateMedicalRecordInput, UpdateMedicalRecordInput } from './medicalRecord.validation';

class MedicalRecordController {
  // Renamed from getAllMedicalRecords to getMyMedicalRecord
  async getMyMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      // The user ID should come from the protect middleware
      const patientId = req.user?._id;
      const record = await MedicalRecordService.getMyMedicalRecord(patientId!.toString());
      res.status(200).json(new ApiResponse(200, record ? toMedicalRecordResponseDto(record) : null, 'Medical record fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await MedicalRecordService.getMedicalRecordById(req.params.id);
      
      // Ownership authorization: Patient can only access their own record
      if (req.user?.roles?.includes('patient') && record?.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this medical record.', 403));
      }

      res.status(200).json(new ApiResponse(200, toMedicalRecordResponseDto(record!), 'Medical record fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const recordData: CreateMedicalRecordInput = req.body;
      const patientId = req.user?._id; // Get patient ID from logged in user

      if (!patientId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ensure patient role can only create for themselves
      if (req.user?.roles?.includes('patient') && patientId.toString() !== req.user._id.toString()) {
        return next(new AppError('Patients can only create medical records for themselves.', 403));
      }

      const newRecord = await MedicalRecordService.createMedicalRecord(patientId.toString(), recordData);
      res.status(201).json(new ApiResponse(201, toMedicalRecordResponseDto(newRecord), 'Medical record created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const recordData: UpdateMedicalRecordInput = req.body;
      
      // Get the record first to check ownership
      const existingRecord = await MedicalRecordService.getMedicalRecordById(req.params.id);
      if (!existingRecord) {
        return next(new AppError('Medical Record not found', 404));
      }

      // Ownership authorization: Patient can only update their own record
      if (req.user?.roles?.includes('patient') && existingRecord.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this medical record.', 403));
      }

      const updatedRecord = await MedicalRecordService.updateMedicalRecord(req.params.id, recordData);
      res.status(200).json(new ApiResponse(200, toMedicalRecordResponseDto(updatedRecord!), 'Medical record updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the record first to check ownership
      const existingRecord = await MedicalRecordService.getMedicalRecordById(req.params.id);
      if (!existingRecord) {
        return next(new AppError('Medical Record not found', 404));
      }

      // Ownership authorization: Patient can only delete their own record
      if (req.user?.roles?.includes('patient') && existingRecord.patient_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this medical record.', 403));
      }

      await MedicalRecordService.deleteMedicalRecord(req.params.id);
      res.status(204).json(new ApiResponse(204, null, 'Medical record deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new MedicalRecordController();
