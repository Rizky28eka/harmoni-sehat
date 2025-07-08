import mongoose, { Schema } from 'mongoose';
import { IMetodePembayaran, IMetodePembayaranModel } from '../types';

const MetodePembayaranSchema = new Schema<IMetodePembayaran, IMetodePembayaranModel>({
    nama: {
        type: String,
        required: true,
        unique: true,
    },
    kode: {
        type: String,
        required: true,
        unique: true,
    },
    deskripsi: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
});

const MetodePembayaran = mongoose.model<IMetodePembayaran, IMetodePembayaranModel>('MetodePembayaran', MetodePembayaranSchema);

export default MetodePembayaran;