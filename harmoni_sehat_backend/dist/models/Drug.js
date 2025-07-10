"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DrugSchema = new mongoose_1.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    deskripsi: {
        type: String,
        trim: true,
    },
    kategori: {
        type: String,
        required: true,
        trim: true,
    },
    stok: {
        type: Number,
        required: true,
        min: 0,
    },
    satuan: {
        type: String,
        required: true,
        trim: true,
    },
    harga: {
        type: Number,
        required: true,
        min: 0,
    },
    kode_obat: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    butuh_resep: {
        type: Boolean,
        default: false,
    },
    tgl_kadaluarsa: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
const Drug = (0, mongoose_1.model)('Drug', DrugSchema);
exports.default = Drug;
