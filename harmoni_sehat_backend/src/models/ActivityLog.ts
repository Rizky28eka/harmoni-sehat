import mongoose, { Schema } from 'mongoose';
import { IActivityLog, IActivityLogModel } from '../types';

const ActivityLogSchema = new Schema<IActivityLog, IActivityLogModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: Object,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ActivityLog = mongoose.model<IActivityLog, IActivityLogModel>('ActivityLog', ActivityLogSchema);

export default ActivityLog;