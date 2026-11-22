import { ownerScope } from '../plugins/ownerScope';
import { mediaWriteOwnScope } from './scopes';
import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  uploaded_by?: Types.ObjectId;
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
    uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    model_type: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for efficient lookups
    },
    model_id: {
      type: Schema.Types.ObjectId,
      required: false,
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

ownerScope(MediaSchema, mediaWriteOwnScope);

const Media = model<IMedia>('Media', MediaSchema);

export default Media;
