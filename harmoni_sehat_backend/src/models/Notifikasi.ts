import mongoose, { Schema } from 'mongoose';
import { INotifikasi, INotifikasiModel } from '../types';

const NotifikasiSchema = new Schema<INotifikasi, INotifikasiModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    judul: {
        type: String,
        required: true,
    },
    isi: {
        type: String,
        required: true,
    },
    tipe: {
        type: String,
        enum: ['info', 'warning', 'error', 'success', 'appointment', 'order'],
        default: 'info',
    },
    is_read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notifikasi = mongoose.model<INotifikasi, INotifikasiModel>('Notifikasi', NotifikasiSchema);

export default Notifikasi;