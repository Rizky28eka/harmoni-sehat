"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConsultationSchema = new mongoose_1.Schema({
    pasien_id: {
        type: String,
        ref: 'Pasien',
        required: true,
    },
    dokter_id: {
        type: String,
        ref: 'Dokter',
        required: true,
    },
    jadwal_id: {
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
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending',
    },
    keluhan: {
        type: String,
        required: true,
        trim: true,
    },
    diagnosa: {
        type: String,
        trim: true,
    },
    tindakan: {
        type: String,
        trim: true,
    },
    catatan_dokter: {
        type: String,
        trim: true,
    },
    video_call_url: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
const Consultation = (0, mongoose_1.model)('Consultation', ConsultationSchema);
exports.default = Consultation;
