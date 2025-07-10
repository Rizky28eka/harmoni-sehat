import { Schema, model, Document, Types } from 'mongoose';

export interface IActivityLog extends Document {
  user_id: Types.ObjectId;
  aksi: string;
  deskripsi?: string;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aksi: {
    type: String,
    required: true,
    trim: true,
  },
  deskripsi: {
    type: String,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActivityLog = model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;