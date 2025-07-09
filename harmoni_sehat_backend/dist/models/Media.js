"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    model_type: {
        type: String,
        required: true,
        trim: true,
    },
    model_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    mime_type: {
        type: String,
    },
    size: {
        type: Number,
    },
}, {
    timestamps: true,
});
const Media = (0, mongoose_1.model)('Media', mediaSchema);
exports.default = Media;
