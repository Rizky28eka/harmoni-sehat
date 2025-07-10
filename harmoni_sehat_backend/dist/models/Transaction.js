"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total_biaya: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    metode_pembayaran_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true,
    },
    external_id: {
        type: String,
        trim: true,
    },
    transaksiable_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    transaksiable_type: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
const Transaction = (0, mongoose_1.model)('Transaction', TransactionSchema);
exports.default = Transaction;
