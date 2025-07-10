import { Request, Response, NextFunction } from 'express';
import chatMessageService from './chatMessage.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

class ChatMessageController {
  async createChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessage = await chatMessageService.createChatMessage(req.body);
      res.status(201).json(new ApiResponse(201, chatMessage, 'Pesan chat berhasil ditambahkan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getAllChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessages = await chatMessageService.getAllChatMessages();
      res.status(200).json(new ApiResponse(200, chatMessages, 'Daftar pesan chat berhasil diambil'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async getChatMessageById(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessage = await chatMessageService.getChatMessageById(req.params.id);
      res.status(200).json(new ApiResponse(200, chatMessage, 'Pesan chat berhasil ditemukan'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async updateChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessage = await chatMessageService.updateChatMessage(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, chatMessage, 'Pesan chat berhasil diperbarui'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }

  async deleteChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      await chatMessageService.deleteChatMessage(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Pesan chat berhasil dihapus'));
    } catch (error: any) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

export default new ChatMessageController();