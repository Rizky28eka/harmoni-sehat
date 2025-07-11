"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DrugOrderDetailSchema = new mongoose_1.Schema({
    pesanan_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DrugOrder',
        required: true,
        index: true, // Add index for efficient lookups
    },
    obat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
        index: true, // Add index for efficient lookups
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
    harga_satuan: {
        type: Number,
        required: true,
        min: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, { timestamps: true });
const DrugOrderDetail = (0, mongoose_1.model)('DrugOrderDetail', DrugOrderDetailSchema);
exports.default = DrugOrderDetail;
