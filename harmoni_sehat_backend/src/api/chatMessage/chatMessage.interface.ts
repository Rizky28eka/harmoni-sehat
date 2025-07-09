import { Types } from 'mongoose';
import { IChatMessage } from '../../models/ChatMessage';

export interface CreateChatMessageDto {
  consultation_id: string; // Will be ObjectId in service
  sender_id: string; // Will be ObjectId in service
  isi: string;
  tipe: 'text' | 'image' | 'document';
  file_url?: string;
  is_read?: boolean;
}

export interface UpdateChatMessageDto {
  isi?: string;
  tipe?: 'text' | 'image' | 'document';
  file_url?: string;
  is_read?: boolean;
}

export interface IChatMessageResponseDto {
  id: string;
  consultation_id: string;
  sender_id: string;
  isi: string;
  tipe: 'text' | 'image' | 'document';
  file_url?: string;
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toChatMessageResponseDto = (chatMessage: IChatMessage): IChatMessageResponseDto => {
  return {
    id: chatMessage._id.toString(),
    consultation_id: chatMessage.consultation_id.toString(),
    sender_id: chatMessage.sender_id.toString(),
    isi: chatMessage.isi,
    tipe: chatMessage.tipe,
    file_url: chatMessage.file_url,
    is_read: chatMessage.is_read,
    createdAt: chatMessage.createdAt,
    updatedAt: chatMessage.updatedAt,
  };
};
