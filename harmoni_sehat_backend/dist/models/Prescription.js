"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PrescriptionSchema = new mongoose_1.Schema({
    konsultasi_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
        unique: true,
    },
    catatan: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active',
    },
    expired_at: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
const Prescription = (0, mongoose_1.model)('Prescription', PrescriptionSchema);
exports.default = Prescription;
