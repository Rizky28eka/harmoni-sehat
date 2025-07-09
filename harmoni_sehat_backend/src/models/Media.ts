import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  _id: Types.ObjectId;
  model_type: string; // e.g., 'User', 'HealthArticle'
  model_id: Types.ObjectId;
  url: string;
  mime_type?: string;
  size?: number; // in bytes
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>({
  model_type: {
    type: String,
    required: true,
    trim: true,
  },
  model_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  mime_type: {
    type: String,
  },
  size: {
    type: Number,
  },
},
{
  timestamps: true,
});

const Media = model<IMedia>('Media', mediaSchema);

export default Media;
