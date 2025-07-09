import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  expired_at: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  expired_at: {
    type: Date,
    required: true,
  },
},
{
  timestamps: true,
});

const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);

export default RefreshToken;
