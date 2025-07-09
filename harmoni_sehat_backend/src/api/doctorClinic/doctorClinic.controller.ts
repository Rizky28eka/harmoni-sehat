import { Request, Response, NextFunction } from 'express';
import DoctorClinicService from './doctorClinic.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDoctorClinicResponseDto } from './doctorClinic.interface';
import { CreateDoctorClinicInput, UpdateDoctorClinicInput } from './doctorClinic.validation';
import Doctor from '../../models/Doctor';

class DoctorClinicController {
  async createDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinicData: CreateDoctorClinicInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ownership check: Doctor can only create associations for themselves
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: userId });
        if (!doctorProfile || doctorProfile._id.toString() !== doctorClinicData.doctor_id) {
          return next(new AppError('Doctors can only create clinic associations for themselves.', 403));
        }
      }

      const newDoctorClinic = await DoctorClinicService.createDoctorClinic(doctorClinicData);
      res.status(201).json(new ApiResponse(201, toDoctorClinicResponseDto(newDoctorClinic), 'Doctor-Clinic association created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctorClinics(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinics = await DoctorClinicService.getAllDoctorClinics();
      res.status(200).json(new ApiResponse(200, doctorClinics.map(toDoctorClinicResponseDto), 'Doctor-Clinic associations fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDoctorClinicById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinic = await DoctorClinicService.getDoctorClinicById(req.params.id);

      // Ownership authorization: Doctor can only access their own associations
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || doctorClinic?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this doctor-clinic association.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toDoctorClinicResponseDto(doctorClinic!), 'Doctor-Clinic association fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDoctorClinicsByDoctorId(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.params.doctorId;

      // Ownership authorization: Doctor can only access their own associations
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || doctorProfile._id.toString() !== doctorId) {
          return next(new AppError('You are not authorized to access these doctor-clinic associations.', 403));
        }
      }

      const doctorClinics = await DoctorClinicService.getDoctorClinicsByDoctorId(doctorId);
      res.status(200).json(new ApiResponse(200, doctorClinics.map(toDoctorClinicResponseDto), 'Doctor-Clinic associations fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinicData: UpdateDoctorClinicInput = req.body;
      const doctorClinicId = req.params.id; // ID of the doctor-clinic association to update

      // Get the association first to check ownership
      const existingDoctorClinic = await DoctorClinicService.getDoctorClinicById(doctorClinicId);
      if (!existingDoctorClinic) {
        return next(new AppError('Doctor-Clinic association not found', 404));
      }

      // Ownership authorization: Doctor can only update their own associations
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingDoctorClinic.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this doctor-clinic association.', 403));
        }
      }

      const updatedDoctorClinic = await DoctorClinicService.updateDoctorClinic(doctorClinicId, doctorClinicData);
      res.status(200).json(new ApiResponse(200, toDoctorClinicResponseDto(updatedDoctorClinic!), 'Doctor-Clinic association updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctorClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorClinicId = req.params.id; // ID of the doctor-clinic association to delete

      // Get the association first to check ownership
      const existingDoctorClinic = await DoctorClinicService.getDoctorClinicById(doctorClinicId);
      if (!existingDoctorClinic) {
        return next(new AppError('Doctor-Clinic association not found', 404));
      }

      // Ownership authorization: Doctor can only delete their own associations
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingDoctorClinic.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this doctor-clinic association.', 403));
        }
      }

      await DoctorClinicService.deleteDoctorClinic(doctorClinicId);
      res.status(204).json(new ApiResponse(204, null, 'Doctor-Clinic association deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DoctorClinicController();
