"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DoctorReviewSchema = new mongoose_1.Schema({
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
    konsultasi_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
        unique: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    komentar: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
const DoctorReview = (0, mongoose_1.model)('DoctorReview', DoctorReviewSchema);
exports.default = DoctorReview;
