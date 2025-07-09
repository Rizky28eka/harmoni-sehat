"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const specializationSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    deskripsi: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Specialization = (0, mongoose_1.model)('Specialization', specializationSchema);
exports.default = Specialization;
