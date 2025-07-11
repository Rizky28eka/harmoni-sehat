"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PrescriptionDrugSchema = new mongoose_1.Schema({
    resep_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true,
        index: true, // Add index for efficient lookups
    },
    obat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
        index: true, // Add index for efficient lookups
    },
    dosis: {
        type: String,
        required: true,
        trim: true,
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
    aturan_pakai: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
const PrescriptionDrug = (0, mongoose_1.model)('PrescriptionDrug', PrescriptionDrugSchema);
exports.default = PrescriptionDrug;
