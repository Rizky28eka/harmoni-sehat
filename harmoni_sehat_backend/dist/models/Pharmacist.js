"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pharmacistSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    nomor_sipa: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const Pharmacist = (0, mongoose_1.model)('Pharmacist', pharmacistSchema);
exports.default = Pharmacist;
