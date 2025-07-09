import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  judul: {
    type: String,
    required: true,
    trim: true,
  },
  isi: {
    type: String,
    required: true,
  },
  tipe: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    required: true,
    trim: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification;
