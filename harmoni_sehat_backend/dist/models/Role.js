"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoleSchema = new mongoose_1.Schema({
    nama_peran: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
});
const Role = (0, mongoose_1.model)('Role', RoleSchema);
exports.default = Role;
