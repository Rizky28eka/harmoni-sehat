"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const Admin = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = Admin;
