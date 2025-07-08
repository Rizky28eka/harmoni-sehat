import mongoose, { Schema } from 'mongoose';
import { IKeranjangObat, IKeranjangObatModel } from '../types';

const KeranjangObatSchema = new Schema<IKeranjangObat, IKeranjangObatModel>({
    pasien_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pasien',
        required: true,
    },
    obat_id: {
        type: Schema.Types.ObjectId,
        ref: 'Obat',
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1,
    },
}, { timestamps: true });

KeranjangObatSchema.index({ pasien_id: 1, obat_id: 1 }, { unique: true });

const KeranjangObat = mongoose.model<IKeranjangObat, IKeranjangObatModel>('KeranjangObat', KeranjangObatSchema);

export default KeranjangObat;