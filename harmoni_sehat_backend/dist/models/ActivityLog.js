"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activityLogSchema = new mongoose_1.Schema({
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
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false, // Using custom timestamp field
});
const ActivityLog = (0, mongoose_1.model)('ActivityLog', activityLogSchema);
exports.default = ActivityLog;
