import { Request, Response, NextFunction } from 'express';
import PatientService from './patient.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPatientResponseDto } from './patient.interface';
import { CreatePatientInput, UpdatePatientInput } from './patient.validation';

class PatientController {
  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patientData: CreatePatientInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newPatient = await PatientService.createPatient(userId.toString(), patientData);
      res.status(201).json(new ApiResponse(201, toPatientResponseDto(newPatient), 'Patient created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
      // This route should ideally be restricted to admins or doctors
      const patients = await PatientService.getAllPatients();
      res.status(200).json(new ApiResponse(200, patients.map(toPatientResponseDto), 'Patients fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);

      // Ownership authorization: Patient can only access their own profile
      if (req.user?.roles?.includes('patient') && patient?.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this patient profile.', 403));
      }

      res.status(200).json(new ApiResponse(200, toPatientResponseDto(patient!), 'Patient fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyPatientProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const patient = await PatientService.getMyPatientProfile(userId.toString());
      res.status(200).json(new ApiResponse(200, toPatientResponseDto(patient!), 'My patient profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patientData: UpdatePatientInput = req.body;
      const patientId = req.params.id; // ID of the patient to update

      // Get the patient first to check ownership
      const existingPatient = await PatientService.getPatientById(patientId);
      if (!existingPatient) {
        return next(new AppError('Patient not found', 404));
      }

      // Ownership authorization: Patient can only update their own profile
      if (req.user?.roles?.includes('patient') && existingPatient.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this patient profile.', 403));
      }

      const updatedPatient = await PatientService.updatePatient(patientId, patientData);
      res.status(200).json(new ApiResponse(200, toPatientResponseDto(updatedPatient!), 'Patient updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.id; // ID of the patient to delete

      // Get the patient first to check ownership
      const existingPatient = await PatientService.getPatientById(patientId);
      if (!existingPatient) {
        return next(new AppError('Patient not found', 404));
      }

      // Ownership authorization: Patient can only delete their own profile
      if (req.user?.roles?.includes('patient') && existingPatient.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this patient profile.', 403));
      }

      await PatientService.deletePatient(patientId);
      res.status(204).json(new ApiResponse(204, null, 'Patient deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PatientController();
