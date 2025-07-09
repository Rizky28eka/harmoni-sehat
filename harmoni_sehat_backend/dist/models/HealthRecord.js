"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const healthRecordSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    bloodPressure: {
        type: String,
        required: [true, 'Blood pressure is required'],
    },
    heartRate: {
        type: Number,
        required: [true, 'Heart rate is required'],
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});
const HealthRecord = (0, mongoose_1.model)('HealthRecord', healthRecordSchema);
exports.default = HealthRecord;
