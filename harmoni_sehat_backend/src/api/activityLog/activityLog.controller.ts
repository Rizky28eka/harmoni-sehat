import { Request, Response, NextFunction } from 'express';
import ActivityLogService from './activityLog.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toActivityLogResponseDto } from './activityLog.interface';
import { CreateActivityLogInput, UpdateActivityLogInput } from './activityLog.validation';

class ActivityLogController {
  async createActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogData: CreateActivityLogInput = req.body;
      const newActivityLog = await ActivityLogService.createActivityLog(activityLogData);
      res.status(201).json(new ApiResponse(201, toActivityLogResponseDto(newActivityLog), 'Activity log created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogs = await ActivityLogService.getAllActivityLogs();
      res.status(200).json(new ApiResponse(200, activityLogs.map(toActivityLogResponseDto), 'Activity logs fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLog = await ActivityLogService.getActivityLogById(req.params.id);
      res.status(200).json(new ApiResponse(200, toActivityLogResponseDto(activityLog!), 'Activity log fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogData: UpdateActivityLogInput = req.body;
      const activityLogId = req.params.id;
      const updatedActivityLog = await ActivityLogService.updateActivityLog(activityLogId, activityLogData);
      res.status(200).json(new ApiResponse(200, toActivityLogResponseDto(updatedActivityLog!), 'Activity log updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogId = req.params.id;
      await ActivityLogService.deleteActivityLog(activityLogId);
      res.status(204).json(new ApiResponse(204, null, 'Activity log deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityLogController();
