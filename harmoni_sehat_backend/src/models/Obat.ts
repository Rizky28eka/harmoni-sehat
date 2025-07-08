import mongoose, { Schema } from 'mongoose';
import { IObat, IObatModel } from '../types';

const ObatSchema = new Schema<IObat, IObatModel>({
    nama: {
        type: String,
        required: true,
    },
    deskripsi: {
        type: String,
    },
    kategori: {
        type: String,
    },
    stok: {
        type: Number,
        default: 0,
    },
    satuan: {
        type: String, // e.g., 'strip', 'botol', 'tablet'
    },
    harga: {
        type: Number,
        required: true,
    },
    kode_obat: {
        type: String,
        unique: true,
        sparse: true,
    },
    butuh_resep: {
        type: Boolean,
        default: false,
    },
    tgl_kadaluarsa: {
        type: Date,
    },
}, { timestamps: true });

const Obat = mongoose.model<IObat, IObatModel>('Obat', ObatSchema);

export default Obat;