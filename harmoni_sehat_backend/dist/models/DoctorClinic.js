"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const doctorClinicSchema = new mongoose_1.Schema({
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});
const DoctorClinic = (0, mongoose_1.model)('DoctorClinic', doctorClinicSchema);
exports.default = DoctorClinic;
