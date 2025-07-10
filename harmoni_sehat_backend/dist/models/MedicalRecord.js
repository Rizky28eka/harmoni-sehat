"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MedicalRecordSchema = new mongoose_1.Schema({
    pasien_id: {
        type: String,
        ref: 'Pasien',
        required: true,
        unique: true,
    },
    riwayat_penyakit: {
        type: [String],
    },
    alergi: {
        type: [String],
    },
    riwayat_vaksinasi: {
        type: [String],
    },
}, { timestamps: true });
const MedicalRecord = (0, mongoose_1.model)('MedicalRecord', MedicalRecordSchema);
exports.default = MedicalRecord;
