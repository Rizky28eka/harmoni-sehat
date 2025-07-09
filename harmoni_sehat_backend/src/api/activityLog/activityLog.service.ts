import ActivityLog, { IActivityLog } from '../../models/ActivityLog';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateActivityLogInput, UpdateActivityLogInput } from './activityLog.validation';
import User from '../../models/User';

class ActivityLogService {
  async createActivityLog(activityLogData: CreateActivityLogInput): Promise<IActivityLog> {
    // Check if user exists
    const user = await User.findById(activityLogData.user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const newActivityLog = await ActivityLog.create(activityLogData);
    return newActivityLog;
  }

  async getAllActivityLogs(): Promise<IActivityLog[]> {
    return ActivityLog.find().populate('user_id');
  }

  async getActivityLogById(activityLogId: string): Promise<IActivityLog | null> {
    if (!Types.ObjectId.isValid(activityLogId)) {
      throw new AppError('Invalid Activity Log ID', 400);
    }
    const activityLog = await ActivityLog.findById(activityLogId).populate('user_id');
    if (!activityLog) {
      throw new AppError('Activity Log not found', 404);
    }
    return activityLog;
  }

  async updateActivityLog(activityLogId: string, activityLogData: UpdateActivityLogInput): Promise<IActivityLog | null> {
    if (!Types.ObjectId.isValid(activityLogId)) {
      throw new AppError('Invalid Activity Log ID', 400);
    }
    const activityLog = await ActivityLog.findByIdAndUpdate(activityLogId, activityLogData, { new: true, runValidators: true });
    if (!activityLog) {
      throw new AppError('Activity Log not found', 404);
    }
    return activityLog;
  }

  async deleteActivityLog(activityLogId: string): Promise<void> {
    if (!Types.ObjectId.isValid(activityLogId)) {
      throw new AppError('Invalid Activity Log ID', 400);
    }
    const activityLog = await ActivityLog.findByIdAndDelete(activityLogId);
    if (!activityLog) {
      throw new AppError('Activity Log not found', 404);
    }
  }
}

export default new ActivityLogService();
