import { Request, Response, NextFunction } from 'express';
import activityLogService from './activityLog.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class ActivityLogController {
  async createActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLog = await activityLogService.createActivityLog(req.body);
      res.status(201).json(new ApiResponse(201, activityLog, 'Log aktivitas berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogs = await activityLogService.getAllActivityLogs();
      res.status(200).json(new ApiResponse(200, activityLogs, 'Daftar log aktivitas berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getActivityLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLog = await activityLogService.getActivityLogById(req.params.id);
      res.status(200).json(new ApiResponse(200, activityLog, 'Log aktivitas berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLog = await activityLogService.updateActivityLog(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, activityLog, 'Log aktivitas berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      await activityLogService.deleteActivityLog(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Log aktivitas berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new ActivityLogController();