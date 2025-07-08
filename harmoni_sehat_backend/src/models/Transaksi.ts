import mongoose, { Schema } from 'mongoose';
import { ITransaksi, ITransaksiModel } from '../types';

const TransaksiSchema = new Schema<ITransaksi, ITransaksiModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total_biaya: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    metode_pembayaran_id: {
        type: Schema.Types.ObjectId,
        ref: 'MetodePembayaran',
    },
    external_id: { // For payment gateway integration
        type: String,
    },
    transaksiable_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    transaksiable_type: {
        type: String,
        required: true,
        enum: ['Konsultasi', 'PesananObat'],
    },
}, { timestamps: true });

const Transaksi = mongoose.model<ITransaksi, ITransaksiModel>('Transaksi', TransaksiSchema);

export default Transaksi;