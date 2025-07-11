import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  model_type: string; // e.g., 'User', 'HealthArticle'
  model_id: Types.ObjectId; // ID of the associated model
  url: string;
  mime_type: string;
  size: number; // in bytes
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    model_type: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for efficient lookups
    },
    model_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true, // Add index for efficient lookups
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    mime_type: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Media = model<IMedia>('Media', MediaSchema);

export default Media;
