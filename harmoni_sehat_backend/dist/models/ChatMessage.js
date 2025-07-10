"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatMessageSchema = new mongoose_1.Schema({
    konsultasi_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
    },
    pengirim_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isi: {
        type: String,
        required: true,
        trim: true,
    },
    tipe: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true,
    },
    file_url: {
        type: String,
        trim: true,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const ChatMessage = (0, mongoose_1.model)('ChatMessage', ChatMessageSchema);
exports.default = ChatMessage;
