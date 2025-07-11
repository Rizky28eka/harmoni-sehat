"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MedicalRecordSchema = new mongoose_1.Schema({
    pasien_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Pasien',
    },
    tanggal_rekam_medis: {
        type: Date,
        default: Date.now,
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis harus diisi'],
        trim: true,
    },
    catatan_dokter: {
        type: String,
        trim: true,
    },
    resep_id: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Prescription',
    },
    riwayat_penyakit: {
        type: [String],
    },
    alergi: {
        type: [String],
    },
    tinggi_badan: Number,
    berat_badan: Number,
    tekanan_darah: String,
    suhu_tubuh: Number,
});
const MedicalRecord = (0, mongoose_1.model)('MedicalRecord', MedicalRecordSchema);
exports.default = MedicalRecord;
