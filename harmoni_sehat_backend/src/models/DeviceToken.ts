import { Schema, model, Document, Types } from 'mongoose';

export interface IDeviceToken extends Document {
  user_id: Types.ObjectId;
  token: string;
  platform: 'android' | 'ios' | 'web';
}

const DeviceTokenSchema = new Schema<IDeviceToken>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['android', 'ios', 'web'], default: 'android' },
  },
  { timestamps: true },
);

export default model<IDeviceToken>('DeviceToken', DeviceTokenSchema);
