import mongoose, { Schema } from 'mongoose';
import { IChatMessage, IChatMessageModel } from '../types';

const ChatMessageSchema = new Schema<IChatMessage, IChatMessageModel>({
    konsultasi_id: {
        type: Schema.Types.ObjectId,
        ref: 'Konsultasi',
        required: true,
    },
    pengirim_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isi: {
        type: String,
        required: true,
    },
    tipe: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
    },
    file_url: {
        type: String,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const ChatMessage = mongoose.model<IChatMessage, IChatMessageModel>('ChatMessage', ChatMessageSchema);

export default ChatMessage;