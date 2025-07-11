"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DoctorClinicSchema = new mongoose_1.Schema({
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });
const DoctorClinic = (0, mongoose_1.model)('DoctorClinic', DoctorClinicSchema);
exports.default = DoctorClinic;
