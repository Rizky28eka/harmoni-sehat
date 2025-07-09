"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicalRecordSchema = new mongoose_1.Schema({
    patient_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
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
}, {
    timestamps: true,
});
const MedicalRecord = (0, mongoose_1.model)('MedicalRecord', medicalRecordSchema);
exports.default = MedicalRecord;
