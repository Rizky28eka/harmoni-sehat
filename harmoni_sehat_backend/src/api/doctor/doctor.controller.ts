import { Request, Response, NextFunction } from 'express';
import DoctorService from './doctor.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toDoctorResponseDto } from './doctor.interface';
import { CreateDoctorInput, UpdateDoctorInput } from './doctor.validation';

class DoctorController {
  async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorData: CreateDoctorInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newDoctor = await DoctorService.createDoctor(userId.toString(), doctorData);
      res.status(201).json(new ApiResponse(201, toDoctorResponseDto(newDoctor), 'Doctor created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await DoctorService.getAllDoctors();
      res.status(200).json(new ApiResponse(200, doctors.map(toDoctorResponseDto), 'Doctors fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await DoctorService.getDoctorById(req.params.id);

      // Ownership authorization: Doctor can only access their own profile
      if (req.user?.roles?.includes('doctor') && doctor?.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to access this doctor profile.', 403));
      }

      res.status(200).json(new ApiResponse(200, toDoctorResponseDto(doctor!), 'Doctor fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyDoctorProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const doctor = await DoctorService.getMyDoctorProfile(userId.toString());
      res.status(200).json(new ApiResponse(200, toDoctorResponseDto(doctor!), 'My doctor profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorData: UpdateDoctorInput = req.body;
      const doctorId = req.params.id; // ID of the doctor to update

      // Get the doctor first to check ownership
      const existingDoctor = await DoctorService.getDoctorById(doctorId);
      if (!existingDoctor) {
        return next(new AppError('Doctor not found', 404));
      }

      // Ownership authorization: Doctor can only update their own profile
      if (req.user?.roles?.includes('doctor') && existingDoctor.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this doctor profile.', 403));
      }

      const updatedDoctor = await DoctorService.updateDoctor(doctorId, doctorData);
      res.status(200).json(new ApiResponse(200, toDoctorResponseDto(updatedDoctor!), 'Doctor updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.params.id; // ID of the doctor to delete

      // Get the doctor first to check ownership
      const existingDoctor = await DoctorService.getDoctorById(doctorId);
      if (!existingDoctor) {
        return next(new AppError('Doctor not found', 404));
      }

      // Ownership authorization: Doctor can only delete their own profile
      if (req.user?.roles?.includes('doctor') && existingDoctor.user_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this doctor profile.', 403));
      }

      await DoctorService.deleteDoctor(doctorId);
      res.status(204).json(new ApiResponse(204, null, 'Doctor deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new DoctorController();
