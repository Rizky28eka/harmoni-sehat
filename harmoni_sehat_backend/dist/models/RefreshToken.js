"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RefreshTokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Add index for efficient lookups
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expired_at: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
const RefreshToken = (0, mongoose_1.model)('RefreshToken', RefreshTokenSchema);
exports.default = RefreshToken;
