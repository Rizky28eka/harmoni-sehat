import mongoose, { Schema } from 'mongoose';
import { IDetailPesananObat, IDetailPesananObatModel } from '../types';

const DetailPesananObatSchema = new Schema<IDetailPesananObat, IDetailPesananObatModel>({
    pesanan_id: {
        type: Schema.Types.ObjectId,
        ref: 'PesananObat',
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
    harga_satuan: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
});

const DetailPesananObat = mongoose.model<IDetailPesananObat, IDetailPesananObatModel>('DetailPesananObat', DetailPesananObatSchema);

export default DetailPesananObat;