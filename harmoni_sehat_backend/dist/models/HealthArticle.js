"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const healthArticleSchema = new mongoose_1.Schema({
    judul: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    konten: {
        type: String,
        required: true,
    },
    author_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    author_type: {
        type: String,
        required: true,
        enum: ['Admin', 'Doctor'],
    },
    status_publikasi: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, {
    timestamps: true,
});
const HealthArticle = (0, mongoose_1.model)('HealthArticle', healthArticleSchema);
exports.default = HealthArticle;
