"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const drugOrderDetailSchema = new mongoose_1.Schema({
    order_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DrugOrder',
        required: true,
    },
    drug_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
    },
    harga_satuan: {
        type: Number,
        required: true,
        min: 0,
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});
const DrugOrderDetail = (0, mongoose_1.model)('DrugOrderDetail', drugOrderDetailSchema);
exports.default = DrugOrderDetail;
