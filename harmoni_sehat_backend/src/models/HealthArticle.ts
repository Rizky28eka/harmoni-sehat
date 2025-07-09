import { Schema, model, Document, Types } from 'mongoose';

export interface IHealthArticle extends Document {
  _id: Types.ObjectId;
  judul: string;
  slug: string;
  konten: string;
  author_id: Types.ObjectId; // Can be Admin or Doctor
  author_type: 'Admin' | 'Doctor';
  status_publikasi: 'draft' | 'published' | 'archived';
}

const healthArticleSchema = new Schema<IHealthArticle>({
  judul: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  konten: {
    type: String,
    required: true,
  },
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  author_type: {
    type: String,
    required: true,
    enum: ['Admin', 'Doctor'],
  },
  status_publikasi: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
},
{
  timestamps: true,
});

const HealthArticle = model<IHealthArticle>('HealthArticle', healthArticleSchema);

export default HealthArticle;
