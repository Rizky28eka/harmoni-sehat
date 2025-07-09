"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const consultationSchema = new mongoose_1.Schema({
    patient_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    schedule_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PracticeSchedule',
        required: true,
    },
    tanggal: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'pending'],
        default: 'pending',
    },
    keluhan: {
        type: String,
        required: true,
    },
    diagnosa: {
        type: String,
    },
    tindakan: {
        type: String,
    },
    catatan_dokter: {
        type: String,
    },
    video_call_url: {
        type: String,
    },
}, {
    timestamps: true,
});
const Consultation = (0, mongoose_1.model)('Consultation', consultationSchema);
exports.default = Consultation;
