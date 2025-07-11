import { Document, Types } from 'mongoose';
import { IChatMessage as IChatMessageModel } from '../../models/ChatMessage';

export interface CreateChatMessageDto {
  konsultasi_id: string; // Will be ObjectId in service
  pengirim_id: string; // Will be ObjectId in service
  isi: string;
  tipe: 'text' | 'image' | 'file';
  file_url?: string;
  is_read?: boolean;
}

export interface UpdateChatMessageDto {
  isi?: string;
  tipe?: 'text' | 'image' | 'file';
  file_url?: string;
  is_read?: boolean;
}

export interface IChatMessageResponseDto {
  id: string;
  konsultasi_id: string;
  pengirim_id: string;
  tipe: 'text' | 'image' | 'file';
  isi: string;
  file_url?: string;
  timestamp: Date;
  is_read: boolean;
}

export const toChatMessageResponseDto = (chatMessage: IChatMessageModel): IChatMessageResponseDto => ({
  id: (chatMessage._id as Types.ObjectId).toString(),
  konsultasi_id: (chatMessage.konsultasi_id as Types.ObjectId).toString(),
  pengirim_id: (chatMessage.pengirim_id as Types.ObjectId).toString(),
  tipe: chatMessage.tipe,
  isi: chatMessage.isi,
  file_url: chatMessage.file_url,
  timestamp: chatMessage.timestamp,
  is_read: chatMessage.is_read,
});