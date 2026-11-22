import { ownerScope } from '../plugins/ownerScope';
import { userOwnedScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user_id: Types.ObjectId;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  data?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Add index for efficient lookups
    },
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    isi: {
      type: String,
      required: true,
      trim: true,
    },
    tipe: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      required: true,
      trim: true,
    },
    data: { type: Map, of: String },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ownerScope(NotificationSchema, userOwnedScope('user_id'));

const Notification = model<INotification>('Notification', NotificationSchema);

export default Notification;
