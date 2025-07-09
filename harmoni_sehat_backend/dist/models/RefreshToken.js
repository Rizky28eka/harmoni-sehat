"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    expired_at: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
const RefreshToken = (0, mongoose_1.model)('RefreshToken', refreshTokenSchema);
exports.default = RefreshToken;
