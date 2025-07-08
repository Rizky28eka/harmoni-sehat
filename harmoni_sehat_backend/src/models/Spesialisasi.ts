import mongoose, { Schema } from 'mongoose';
import { ISpesialisasi, ISpesialisasiModel } from '../types';

const SpesialisasiSchema = new Schema<ISpesialisasi, ISpesialisasiModel>({
    nama: {
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

const Spesialisasi = mongoose.model<ISpesialisasi, ISpesialisasiModel>('Spesialisasi', SpesialisasiSchema);

export default Spesialisasi;