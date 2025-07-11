"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HealthArticleSchema = new mongoose_1.Schema({
    judul: {
        type: String,
        required: true,
        trim: true,
        index: true, // Add index for efficient lookups
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // Add index for efficient lookups
    },
    konten: {
        type: String,
        required: true,
    },
    penulis_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Refers to User model, as both Admin and Dokter are Users
        required: true,
    },
    status_publikasi: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, { timestamps: true });
const HealthArticle = (0, mongoose_1.model)('HealthArticle', HealthArticleSchema);
exports.default = HealthArticle;
