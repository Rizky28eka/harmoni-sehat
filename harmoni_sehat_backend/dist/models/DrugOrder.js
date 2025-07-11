"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DrugOrderSchema = new mongoose_1.Schema({
    pasien_id: {
        type: String,
        ref: 'Pasien',
        required: true,
        index: true, // Add index for efficient lookups
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
        trim: true,
    },
}, { timestamps: true });
const DrugOrder = (0, mongoose_1.model)('DrugOrder', DrugOrderSchema);
exports.default = DrugOrder;
