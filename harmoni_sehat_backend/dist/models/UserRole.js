"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRoleSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
}, {
    timestamps: true,
});
userRoleSchema.index({ user_id: 1, role_id: 1 }, { unique: true });
const UserRole = (0, mongoose_1.model)('UserRole', userRoleSchema);
exports.default = UserRole;
