import mongoose, { Schema } from 'mongoose';
import { IJadwalPraktik, IJadwalPraktikModel } from '../types';

const JadwalPraktikSchema = new Schema<IJadwalPraktik, IJadwalPraktikModel>({
    dokter_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dokter',
        required: true,
    },
    klinik_id: {
        type: Schema.Types.ObjectId,
        ref: 'Klinik',
        required: true,
    },
    hari: {
        type: String,
        required: true,
        enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    },
    jam_mulai: {
        type: String, // e.g., '09:00'
        required: true,
    },
    jam_selesai: {
        type: String, // e.g., '17:00'
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const JadwalPraktik = mongoose.model<IJadwalPraktik, IJadwalPraktikModel>('JadwalPraktik', JadwalPraktikSchema);

export default JadwalPraktik;