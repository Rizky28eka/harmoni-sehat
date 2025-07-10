"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserProfileSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const UserProfile = (0, mongoose_1.model)('UserProfile', UserProfileSchema);
exports.default = UserProfile;
