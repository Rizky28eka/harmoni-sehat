"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SpecializationSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true, // Add index for efficient lookups
    },
    deskripsi: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const Specialization = (0, mongoose_1.model)('Specialization', SpecializationSchema);
exports.default = Specialization;
