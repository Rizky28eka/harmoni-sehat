import mongoose, { Schema } from 'mongoose';
import { IKonsultasi, IKonsultasiModel } from '../types';

const KonsultasiSchema = new Schema<IKonsultasi, IKonsultasiModel>({
    pasien_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pasien',
        required: true,
    },
    dokter_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dokter',
        required: true,
    },
    jadwal_id: {
        type: Schema.Types.ObjectId,
        ref: 'JadwalPraktik',
    },
    tanggal: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending',
    },
    keluhan: {
        type: String,
    },
    diagnosa: {
        type: String,
    },
    tindakan: {
        type: String,
    },
    catatan_dokter: {
        type: String,
    },
    video_call_url: {
        type: String,
    },
}, { timestamps: true });

const Konsultasi = mongoose.model<IKonsultasi, IKonsultasiModel>('Konsultasi', KonsultasiSchema);

export default Konsultasi;