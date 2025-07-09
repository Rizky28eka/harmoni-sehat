"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clinicSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    alamat: {
        type: String,
        required: true,
        trim: true,
    },
    no_telepon: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});
const Clinic = (0, mongoose_1.model)('Clinic', clinicSchema);
exports.default = Clinic;
