"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DrugCartSchema = new mongoose_1.Schema({
    pasien_id: {
        type: String,
        ref: 'Pasien',
        required: true,
    },
    obat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
}, { timestamps: true });
const DrugCart = (0, mongoose_1.model)('DrugCart', DrugCartSchema);
exports.default = DrugCart;
