"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserRoleSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Add index for efficient lookups
    },
    peran_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
}, { timestamps: true });
const UserRole = (0, mongoose_1.model)('UserRole', UserRoleSchema);
exports.default = UserRole;
