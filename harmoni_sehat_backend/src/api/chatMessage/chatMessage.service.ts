import ChatMessage, { IChatMessage } from '../../models/ChatMessage';
import { AppError } from '../../utils/AppError';

class ChatMessageService {
  async createChatMessage(data: Partial<IChatMessage>): Promise<IChatMessage> {
    const chatMessage = await ChatMessage.create(data);
    return chatMessage;
  }

  async getAllChatMessages(): Promise<IChatMessage[]> {
    const chatMessages = await ChatMessage.find().populate('konsultasi_id').populate('pengirim_id');
    return chatMessages;
  }

  async getChatMessageById(id: string): Promise<IChatMessage> {
    const chatMessage = await ChatMessage.findById(id).populate('konsultasi_id').populate('pengirim_id');
    if (!chatMessage) {
      throw new AppError('Pesan chat tidak ditemukan', 404);
    }
    return chatMessage;
  }

  async updateChatMessage(id: string, data: Partial<IChatMessage>): Promise<IChatMessage> {
    const chatMessage = await ChatMessage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!chatMessage) {
      throw new AppError('Pesan chat tidak ditemukan', 404);
    }
    return chatMessage;
  }

  async deleteChatMessage(id: string): Promise<void> {
    const chatMessage = await ChatMessage.findByIdAndDelete(id);
    if (!chatMessage) {
      throw new AppError('Pesan chat tidak ditemukan', 404);
    }
  }
}

export default new ChatMessageService();