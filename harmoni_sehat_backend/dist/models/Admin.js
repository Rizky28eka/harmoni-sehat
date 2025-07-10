"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const idGenerator_1 = require("../utils/idGenerator");
const AdminSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: () => (0, idGenerator_1.generateCustomId)('04', 12), // Admin ID starts with 04
    },
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
}, { _id: false, timestamps: true }); // Disable default _id generation
const Admin = (0, mongoose_1.model)('Admin', AdminSchema);
exports.default = Admin;
