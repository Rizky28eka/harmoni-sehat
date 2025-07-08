import mongoose, { Schema } from 'mongoose';
import { IKlinik, IKlinikModel } from '../types';

const KlinikSchema = new Schema<IKlinik, IKlinikModel>({
    nama: {
        type: String,
        required: true,
    },
    alamat: {
        type: String,
    },
    no_telepon: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });

const Klinik = mongoose.model<IKlinik, IKlinikModel>('Klinik', KlinikSchema);

export default Klinik;