"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClinicSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true, // Add index for efficient lookups
    },
    alamat: {
        type: String,
        required: true,
        trim: true,
    },
    no_telepon: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null values to not violate unique constraint
        lowercase: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});
const Clinic = (0, mongoose_1.model)('Clinic', ClinicSchema);
exports.default = Clinic;
