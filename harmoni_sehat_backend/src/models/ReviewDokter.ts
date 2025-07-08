import mongoose, { Schema } from 'mongoose';
import { IReviewDokter, IReviewDokterModel } from '../types';

const ReviewDokterSchema = new Schema<IReviewDokter, IReviewDokterModel>({
    pasien_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pasien',
        required: true,
    },
    dokter_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dokter',
        required: true,
    },
    konsultasi_id: {
        type: Schema.Types.ObjectId,
        ref: 'Konsultasi',
        required: true,
        unique: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    komentar: {
        type: String,
    },
}, { timestamps: true });

const ReviewDokter = mongoose.model<IReviewDokter, IReviewDokterModel>('ReviewDokter', ReviewDokterSchema);

export default ReviewDokter;