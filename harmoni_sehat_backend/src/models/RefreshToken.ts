import mongoose, { Schema } from 'mongoose';
import { IRefreshToken, IRefreshTokenModel } from '../types';

const RefreshTokenSchema = new Schema<IRefreshToken, IRefreshTokenModel>({
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

const RefreshToken = mongoose.model<IRefreshToken, IRefreshTokenModel>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;