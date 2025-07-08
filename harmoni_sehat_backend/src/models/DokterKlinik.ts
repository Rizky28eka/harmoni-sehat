import mongoose, { Schema } from 'mongoose';
import { IDokterKlinik, IDokterKlinikModel } from '../types';

const DokterKlinikSchema = new Schema<IDokterKlinik, IDokterKlinikModel>({
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});

DokterKlinikSchema.index({ dokter_id: 1, klinik_id: 1 }, { unique: true });

const DokterKlinik = mongoose.model<IDokterKlinik, IDokterKlinikModel>('DokterKlinik', DokterKlinikSchema);

export default DokterKlinik;