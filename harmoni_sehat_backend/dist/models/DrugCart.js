"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const drugCartSchema = new mongoose_1.Schema({
    patient_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    drug_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
}, {
    timestamps: true,
});
drugCartSchema.index({ patient_id: 1, drug_id: 1 }, { unique: true });
const DrugCart = (0, mongoose_1.model)('DrugCart', drugCartSchema);
exports.default = DrugCart;
