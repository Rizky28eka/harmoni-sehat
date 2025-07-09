"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const drugOrderSchema = new mongoose_1.Schema({
    patient_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    kode_pesanan: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    total_harga: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    alamat_pengiriman: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const DrugOrder = (0, mongoose_1.model)('DrugOrder', drugOrderSchema);
exports.default = DrugOrder;
