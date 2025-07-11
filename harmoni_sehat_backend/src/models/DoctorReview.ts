import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctorReview extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  dokter_id: string; // Refers to Dokter's custom _id
  konsultasi_id: Types.ObjectId;
  rating: number;
  komentar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorReviewSchema = new Schema<IDoctorReview>(
  {
    pasien_id: {
      type: String,
      ref: 'Pasien',
      required: true,
      index: true, // Add index for efficient lookups
    },
    dokter_id: {
      type: String,
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
  },
  { timestamps: true },
);

const DoctorReview = model<IDoctorReview>('DoctorReview', DoctorReviewSchema);

export default DoctorReview;
