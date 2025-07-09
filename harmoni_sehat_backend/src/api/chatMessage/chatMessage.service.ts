import ChatMessage, { IChatMessage } from '../../models/ChatMessage';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateChatMessageInput, UpdateChatMessageInput } from './chatMessage.validation';
import Consultation from '../../models/Consultation';

class ChatMessageService {
  async createChatMessage(senderId: string, chatMessageData: CreateChatMessageInput): Promise<IChatMessage> {
    // Basic validation for consultation_id existence
    if (!Types.ObjectId.isValid(chatMessageData.consultation_id)) {
      throw new AppError('Invalid Consultation ID', 400);
    }

    const consultation = await Consultation.findById(chatMessageData.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }

    const newChatMessage = await ChatMessage.create({ ...chatMessageData, sender_id: senderId });
    return newChatMessage;
  }

  async getAllChatMessages(): Promise<IChatMessage[]> {
    return ChatMessage.find().populate('consultation_id').populate('sender_id');
  }

  async getChatMessageById(chatMessageId: string): Promise<IChatMessage | null> {
    if (!Types.ObjectId.isValid(chatMessageId)) {
      throw new AppError('Invalid Chat Message ID', 400);
    }
    const chatMessage = await ChatMessage.findById(chatMessageId).populate('consultation_id').populate('sender_id');
    if (!chatMessage) {
      throw new AppError('Chat Message not found', 404);
    }
    return chatMessage;
  }

  async getChatMessagesByConsultation(consultationId: string): Promise<IChatMessage[]> {
    if (!Types.ObjectId.isValid(consultationId)) {
      throw new AppError('Invalid Consultation ID', 400);
    }
    return ChatMessage.find({ consultation_id: consultationId }).populate('sender_id');
  }

  async updateChatMessage(chatMessageId: string, chatMessageData: UpdateChatMessageInput): Promise<IChatMessage | null> {
    if (!Types.ObjectId.isValid(chatMessageId)) {
      throw new AppError('Invalid Chat Message ID', 400);
    }
    const chatMessage = await ChatMessage.findByIdAndUpdate(chatMessageId, chatMessageData, { new: true, runValidators: true });
    if (!chatMessage) {
      throw new AppError('Chat Message not found', 404);
    }
    return chatMessage;
  }

  async deleteChatMessage(chatMessageId: string): Promise<void> {
    if (!Types.ObjectId.isValid(chatMessageId)) {
      throw new AppError('Invalid Chat Message ID', 400);
    }
    const chatMessage = await ChatMessage.findByIdAndDelete(chatMessageId);
    if (!chatMessage) {
      throw new AppError('Chat Message not found', 404);
    }
  }
}

export default new ChatMessageService();
