"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const practiceScheduleSchema = new mongoose_1.Schema({
    doctor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    clinic_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
    },
    hari: {
        type: String,
        enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        required: true,
        trim: true,
    },
    jam_mulai: {
        type: String,
        required: true,
        trim: true,
    },
    jam_selesai: {
        type: String,
        required: true,
        trim: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const PracticeSchedule = (0, mongoose_1.model)('PracticeSchedule', practiceScheduleSchema);
exports.default = PracticeSchedule;
