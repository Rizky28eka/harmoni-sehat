import mongoose, { Schema } from 'mongoose';
import { IResepObat, IResepObatModel } from '../types';

const ResepObatSchema = new Schema<IResepObat, IResepObatModel>({
    resep_id: {
        type: Schema.Types.ObjectId,
        ref: 'Resep',
        required: true,
    },
    obat_id: {
        type: Schema.Types.ObjectId,
        ref: 'Obat',
        required: true,
    },
    dosis: {
        type: String,
    },
    jumlah: {
        type: Number,
        required: true,
    },
    aturan_pakai: {
        type: String,
    },
});

ResepObatSchema.index({ resep_id: 1, obat_id: 1 }, { unique: true });

const ResepObat = mongoose.model<IResepObat, IResepObatModel>('ResepObat', ResepObatSchema);

export default ResepObat;