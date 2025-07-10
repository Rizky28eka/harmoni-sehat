import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  user_id: Types.ObjectId;
  token: string;
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expired_at: {
    type: Date,
    required: true,
  },
  
}, { timestamps: true });

const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;