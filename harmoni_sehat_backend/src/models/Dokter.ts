import mongoose, { Schema } from 'mongoose';
import { IDokter, IDokterModel } from '../types';

const DokterSchema = new Schema<IDokter, IDokterModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    spesialisasi: {
        type: String,
        required: true,
        trim: true,
    },
    noIzinPraktik: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    alamatKlinik: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

const Dokter = mongoose.model<IDokter, IDokterModel>('Dokter', DokterSchema);

export default Dokter;