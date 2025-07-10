"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ActivityLogSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    aksi: {
        type: String,
        required: true,
        trim: true,
    },
    deskripsi: {
        type: String,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const ActivityLog = (0, mongoose_1.model)('ActivityLog', ActivityLogSchema);
exports.default = ActivityLog;
