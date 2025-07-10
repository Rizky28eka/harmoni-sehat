import ActivityLog, { IActivityLog } from '../../models/ActivityLog';
import { AppError } from '../../utils/AppError';

class ActivityLogService {
  async createActivityLog(data: Partial<IActivityLog>): Promise<IActivityLog> {
    const activityLog = await ActivityLog.create(data);
    return activityLog;
  }

  async getAllActivityLogs(): Promise<IActivityLog[]> {
    const activityLogs = await ActivityLog.find().populate('user_id');
    return activityLogs;
  }

  async getActivityLogById(id: string): Promise<IActivityLog> {
    const activityLog = await ActivityLog.findById(id).populate('user_id');
    if (!activityLog) {
      throw new AppError('Log aktivitas tidak ditemukan', 404);
    }
    return activityLog;
  }

  async updateActivityLog(id: string, data: Partial<IActivityLog>): Promise<IActivityLog> {
    const activityLog = await ActivityLog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!activityLog) {
      throw new AppError('Log aktivitas tidak ditemukan', 404);
    }
    return activityLog;
  }

  async deleteActivityLog(id: string): Promise<void> {
    const activityLog = await ActivityLog.findByIdAndDelete(id);
    if (!activityLog) {
      throw new AppError('Log aktivitas tidak ditemukan', 404);
    }
  }
}

export default new ActivityLogService();