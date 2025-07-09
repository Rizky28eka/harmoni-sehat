import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  consultation_id: Types.ObjectId;
  sender_id: Types.ObjectId; // User ID of sender
  isi: string;
  tipe: 'text' | 'image' | 'document';
  file_url?: string;
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  consultation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isi: {
    type: String,
    required: true,
  },
  tipe: {
    type: String,
    enum: ['text', 'image', 'document'],
    required: true,
  },
  file_url: {
    type: String,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});

const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
