"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false, // Do not return password by default
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
