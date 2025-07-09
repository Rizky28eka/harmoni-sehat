"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    nomor_str: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    specialization_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true,
    },
    biaya_konsultasi: {
        type: Number,
        required: true,
    },
    foto: {
        type: String,
    },
    bio: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
const Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
exports.default = Doctor;
