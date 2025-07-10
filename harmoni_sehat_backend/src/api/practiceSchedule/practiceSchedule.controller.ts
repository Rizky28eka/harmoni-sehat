import { Request, Response, NextFunction } from 'express';
import practiceScheduleService from './practiceSchedule.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class PracticeScheduleController {
  async createPracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const practiceSchedule = await practiceScheduleService.createPracticeSchedule(req.body);
      res.status(201).json(new ApiResponse(201, practiceSchedule, 'Jadwal praktik berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllPracticeSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const practiceSchedules = await practiceScheduleService.getAllPracticeSchedules();
      res.status(200).json(new ApiResponse(200, practiceSchedules, 'Daftar jadwal praktik berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getPracticeScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const practiceSchedule = await practiceScheduleService.getPracticeScheduleById(req.params.id);
      res.status(200).json(new ApiResponse(200, practiceSchedule, 'Jadwal praktik berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updatePracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const practiceSchedule = await practiceScheduleService.updatePracticeSchedule(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, practiceSchedule, 'Jadwal praktik berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deletePracticeSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      await practiceScheduleService.deletePracticeSchedule(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Jadwal praktik berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new PracticeScheduleController();