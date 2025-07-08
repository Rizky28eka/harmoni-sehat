import mongoose, { Schema } from 'mongoose';
import { IPeran, IPeranModel } from '../types';

const PeranSchema = new Schema<IPeran, IPeranModel>({
    nama_peran: {
        type: String,
        required: true,
        unique: true,
    },
});

const Peran = mongoose.model<IPeran, IPeranModel>('Peran', PeranSchema);

export default Peran;