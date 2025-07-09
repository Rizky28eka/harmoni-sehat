import { Schema, model, Document, Types } from 'mongoose';

export interface IActivityLog extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  aksi: string;
  deskripsi?: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
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
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: false, // Using custom timestamp field
});

const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
