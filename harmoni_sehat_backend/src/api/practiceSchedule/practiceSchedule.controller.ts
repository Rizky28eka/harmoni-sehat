import { Request, Response, NextFunction } from 'express';
import PracticeScheduleService from './practiceSchedule.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPracticeScheduleResponseDto } from './practiceSchedule.interface';
import { CreatePracticeScheduleInput, UpdatePracticeScheduleInput } from './practiceSchedule.validation';
import Doctor from '../../models/Doctor';

class PracticeScheduleController {
  async createPracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const scheduleData: CreatePracticeScheduleInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ownership check: Doctor can only create schedules for themselves
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: userId });
        if (!doctorProfile || doctorProfile._id.toString() !== scheduleData.doctor_id) {
          return next(new AppError('Doctors can only create schedules for themselves.', 403));
        }
      }

      const newSchedule = await PracticeScheduleService.createPracticeSchedule(userId.toString(), scheduleData);
      res.status(201).json(new ApiResponse(201, toPracticeScheduleResponseDto(newSchedule), 'Practice schedule created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPracticeSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const schedules = await PracticeScheduleService.getAllPracticeSchedules();
      res.status(200).json(new ApiResponse(200, schedules.map(toPracticeScheduleResponseDto), 'Practice schedules fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPracticeScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await PracticeScheduleService.getPracticeScheduleById(req.params.id);

      // Ownership authorization: Doctor can only access their own schedules
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || schedule?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this practice schedule.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toPracticeScheduleResponseDto(schedule!), 'Practice schedule fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyPracticeSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const schedules = await PracticeScheduleService.getDoctorPracticeSchedules(userId.toString());
      res.status(200).json(new ApiResponse(200, schedules.map(toPracticeScheduleResponseDto), 'My practice schedules fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const scheduleData: UpdatePracticeScheduleInput = req.body;
      const scheduleId = req.params.id; // ID of the practice schedule to update

      // Get the schedule first to check ownership
      const existingSchedule = await PracticeScheduleService.getPracticeScheduleById(scheduleId);
      if (!existingSchedule) {
        return next(new AppError('Practice Schedule not found', 404));
      }

      // Ownership authorization: Doctor can only update their own schedules
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingSchedule.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this practice schedule.', 403));
        }
      }

      const updatedSchedule = await PracticeScheduleService.updatePracticeSchedule(scheduleId, scheduleData);
      res.status(200).json(new ApiResponse(200, toPracticeScheduleResponseDto(updatedSchedule!), 'Practice schedule updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const scheduleId = req.params.id; // ID of the practice schedule to delete

      // Get the schedule first to check ownership
      const existingSchedule = await PracticeScheduleService.getPracticeScheduleById(scheduleId);
      if (!existingSchedule) {
        return next(new AppError('Practice Schedule not found', 404));
      }

      // Ownership authorization: Doctor can only delete their own schedules
      if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingSchedule.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this practice schedule.', 403));
        }
      }

      await PracticeScheduleService.deletePracticeSchedule(scheduleId);
      res.status(204).json(new ApiResponse(204, null, 'Practice schedule deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PracticeScheduleController();
