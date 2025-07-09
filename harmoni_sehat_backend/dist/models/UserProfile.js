"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userProfileSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    foto: {
        type: String,
    },
    bio: {
        type: String,
    },
}, {
    timestamps: { createdAt: false, updatedAt: true }, // Only track updatedAt
});
const UserProfile = (0, mongoose_1.model)('UserProfile', userProfileSchema);
exports.default = UserProfile;
