import mongoose, { Schema } from 'mongoose';
import { IResep, IResepModel } from '../types';

const ResepSchema = new Schema<IResep, IResepModel>({
    konsultasi_id: {
        type: Schema.Types.ObjectId,
        ref: 'Konsultasi',
        required: true,
        unique: true,
    },
    catatan: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'issued', 'filled', 'cancelled'],
        default: 'pending',
    },
    expired_at: {
        type: Date,
    },
}, { timestamps: true });

const Resep = mongoose.model<IResep, IResepModel>('Resep', ResepSchema);

export default Resep;