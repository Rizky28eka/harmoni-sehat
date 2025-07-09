"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const patientSchema = new mongoose_1.Schema({
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
    nik: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    tanggal_lahir: {
        type: Date,
        required: true,
    },
    jenis_kelamin: {
        type: String,
        enum: ['Laki-laki', 'Perempuan'],
        required: true,
    },
    alamat: {
        type: String,
        required: true,
    },
    no_telepon: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Patient = (0, mongoose_1.model)('Patient', patientSchema);
exports.default = Patient;
