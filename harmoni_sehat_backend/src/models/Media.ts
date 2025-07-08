import mongoose, { Schema } from 'mongoose';
import { IMedia, IMediaModel } from '../types';

const MediaSchema = new Schema<IMedia, IMediaModel>({
    model_type: {
        type: String,
        required: true,
    },
    model_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    mime_type: {
        type: String,
    },
    size: {
        type: Number, // in bytes
    },
}, { timestamps: true });

MediaSchema.index({ model_type: 1, model_id: 1 });

const Media = mongoose.model<IMedia, IMediaModel>('Media', MediaSchema);

export default Media;