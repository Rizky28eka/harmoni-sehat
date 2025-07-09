"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatMessageSchema = new mongoose_1.Schema({
    consultation_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
    },
    sender_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isi: {
        type: String,
        required: true,
    },
    tipe: {
        type: String,
        enum: ['text', 'image', 'document'],
        required: true,
    },
    file_url: {
        type: String,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const ChatMessage = (0, mongoose_1.model)('ChatMessage', chatMessageSchema);
exports.default = ChatMessage;
