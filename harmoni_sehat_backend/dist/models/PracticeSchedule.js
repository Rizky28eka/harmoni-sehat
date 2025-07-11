"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PracticeScheduleSchema = new mongoose_1.Schema({
    dokter_id: {
        type: String,
        ref: 'Dokter',
        required: true,
        index: true, // Add index for efficient lookups
    },
    klinik_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true, // Add index for efficient lookups
    },
    hari: {
        type: String,
        required: true,
        enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    },
    jam_mulai: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
    },
    jam_selesai: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const PracticeSchedule = (0, mongoose_1.model)('PracticeSchedule', PracticeScheduleSchema);
exports.default = PracticeSchedule;
