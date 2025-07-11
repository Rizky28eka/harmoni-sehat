"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Add index for efficient lookups
    },
    judul: {
        type: String,
        required: true,
        trim: true,
    },
    isi: {
        type: String,
        required: true,
        trim: true,
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
}, { timestamps: true });
const Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = Notification;
