"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const doctorReviewSchema = new mongoose_1.Schema({
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
    consultation_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
        unique: true, // One review per consultation
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    komentar: {
        type: String,
    },
}, {
    timestamps: true,
});
const DoctorReview = (0, mongoose_1.model)('DoctorReview', doctorReviewSchema);
exports.default = DoctorReview;
