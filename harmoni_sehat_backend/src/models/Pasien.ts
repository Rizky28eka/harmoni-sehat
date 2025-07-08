import mongoose, { Schema } from 'mongoose';
import { IPasien, IPasienModel } from '../types';

const PasienSchema = new Schema<IPasien, IPasienModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    nik: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
    },
}, { timestamps: true });

const Pasien = mongoose.model<IPasien, IPasienModel>('Pasien', PasienSchema);

export default Pasien;