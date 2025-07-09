"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentMethodSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    kode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    deskripsi: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const PaymentMethod = (0, mongoose_1.model)('PaymentMethod', paymentMethodSchema);
exports.default = PaymentMethod;
