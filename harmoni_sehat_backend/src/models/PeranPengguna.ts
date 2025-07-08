import mongoose, { Schema } from 'mongoose';
import { IPeranPengguna, IPeranPenggunaModel } from '../types';

const PeranPenggunaSchema = new Schema<IPeranPengguna, IPeranPenggunaModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    peran_id: {
        type: Schema.Types.ObjectId,
        ref: 'Peran',
        required: true,
    },
});

// Compound index to ensure a user has a role only once
PeranPenggunaSchema.index({ user_id: 1, peran_id: 1 }, { unique: true });

const PeranPengguna = mongoose.model<IPeranPengguna, IPeranPenggunaModel>('PeranPengguna', PeranPenggunaSchema);

export default PeranPengguna;