import { Types } from 'mongoose';
import { IChatMessage } from '../../models/ChatMessage';

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
  isi: string;
  tipe: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  timestamp: Date;
}

export const toChatMessageResponseDto = (chatMessage: any): IChatMessageResponseDto => {
  return {
    id: chatMessage._id.toString(),
    konsultasi_id: chatMessage.konsultasi_id.toString(),
    pengirim_id: chatMessage.pengirim_id.toString(),
    isi: chatMessage.isi,
    tipe: chatMessage.tipe,
    file_url: chatMessage.file_url,
    is_read: chatMessage.is_read,
    timestamp: chatMessage.timestamp,
  };
};
