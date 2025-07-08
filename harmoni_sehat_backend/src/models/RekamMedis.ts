import mongoose, { Schema } from 'mongoose';
import { IRekamMedis, IRekamMedisModel } from '../types';

const RekamMedisSchema = new Schema<IRekamMedis, IRekamMedisModel>({
    pasien_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pasien',
        required: true,
        unique: true,
    },
    riwayat_penyakit: {
        type: [String],
    },
    alergi: {
        type: [String],
    },
    riwayat_vaksinasi: {
        type: [String],
    },
}, { timestamps: true });

const RekamMedis = mongoose.model<IRekamMedis, IRekamMedisModel>('RekamMedis', RekamMedisSchema);

export default RekamMedis;