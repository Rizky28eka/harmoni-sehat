import { Schema, model, Document, Types } from 'mongoose';

export interface IHealthArticle extends Document {
  judul: string;
  slug: string;
  konten: string;
  penulis_id: Types.ObjectId; // Can be Admin or Dokter user_id
  status_publikasi: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const HealthArticleSchema = new Schema<IHealthArticle>(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for efficient lookups
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Add index for efficient lookups
    },
    konten: {
      type: String,
      required: true,
    },
    penulis_id: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Refers to User model, as both Admin and Dokter are Users
      required: true,
    },
    status_publikasi: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true },
);

const HealthArticle = model<IHealthArticle>('HealthArticle', HealthArticleSchema);

export default HealthArticle;
