"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const prescriptionDrugSchema = new mongoose_1.Schema({
    prescription_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true,
    },
    drug_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
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
    },
}, {
    timestamps: true,
});
const PrescriptionDrug = (0, mongoose_1.model)('PrescriptionDrug', prescriptionDrugSchema);
exports.default = PrescriptionDrug;
