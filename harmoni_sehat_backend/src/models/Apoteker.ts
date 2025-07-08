import mongoose, { Schema } from 'mongoose';
import { IApoteker, IApotekerModel } from '../types';

const ApotekerSchema = new Schema<IApoteker, IApotekerModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    noSTRA: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    alamatApotek: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

const Apoteker = mongoose.model<IApoteker, IApotekerModel>('Apoteker', ApotekerSchema);

export default Apoteker;