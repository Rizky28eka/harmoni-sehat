"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MediaSchema = new mongoose_1.Schema({
    model_type: {
        type: String,
        required: true,
        trim: true,
        index: true, // Add index for efficient lookups
    },
    model_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true, // Add index for efficient lookups
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    mime_type: {
        type: String,
        required: true,
        trim: true,
    },
    size: {
        type: Number,
        required: true,
        min: 0,
    },
}, { timestamps: true });
const Media = (0, mongoose_1.model)('Media', MediaSchema);
exports.default = Media;
