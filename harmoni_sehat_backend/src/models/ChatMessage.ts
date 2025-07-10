import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  konsultasi_id: Types.ObjectId;
  pengirim_id: Types.ObjectId; // User ID of sender
  isi: string;
  tipe: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  konsultasi_id: {
    type: Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
  },
  pengirim_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isi: {
    type: String,
    required: true,
    trim: true,
  },
  tipe: {
    type: String,
    enum: ['text', 'image', 'file'],
    required: true,
  },
  file_url: {
    type: String,
    trim: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;