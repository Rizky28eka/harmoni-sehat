import mongoose, { Schema } from 'mongoose';
import { IPesananObat, IPesananObatModel } from '../types';

const PesananObatSchema = new Schema<IPesananObat, IPesananObatModel>({
    pasien_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pasien',
        required: true,
    },
    kode_pesanan: {
        type: String,
        required: true,
        unique: true,
    },
    total_harga: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    alamat_pengiriman: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const PesananObat = mongoose.model<IPesananObat, IPesananObatModel>('PesananObat', PesananObatSchema);

export default PesananObat;