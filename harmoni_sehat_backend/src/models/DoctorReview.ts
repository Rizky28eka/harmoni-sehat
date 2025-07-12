import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctorReview extends Document {
  pasien_id: Types.ObjectId; // Refers to Pasien's custom _id
  dokter_id: Types.ObjectId; // Refers to Dokter's custom _id
  konsultasi_id: Types.ObjectId;
  rating: number;
  komentar?: string;
  balasan?: string;
  sentimen?: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}

const DoctorReviewSchema = new Schema<IDoctorReview>(
  {
    pasien_id: {
      type: Schema.Types.ObjectId,
      ref: 'Pasien',
      required: true,
      index: true, // Add index for efficient lookups
    },
    dokter_id: {
      type: Schema.Types.ObjectId,
      ref: 'Dokter',
      required: true,
      index: true, // Add index for efficient lookups
    },
    konsultasi_id: {
      type: Schema.Types.ObjectId,
      ref: 'Consultation',
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
      trim: true,
    },
    balasan: {
      type: String,
      trim: true,
    },
    sentimen: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
  },
);

const DoctorReview = model<IDoctorReview>('DoctorReview', DoctorReviewSchema);

export default DoctorReview;
