import { Request, Response, NextFunction } from 'express';
import ChatMessageService from './chatMessage.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toChatMessageResponseDto } from './chatMessage.interface';
import { CreateChatMessageInput, UpdateChatMessageInput } from './chatMessage.validation';
import Consultation from '../../models/Consultation';

class ChatMessageController {
  async createChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessageData: CreateChatMessageInput = req.body;
      const senderId = req.user?._id; // Get sender ID from logged in user

      if (!senderId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ownership check: Ensure sender is part of the consultation
      const consultation = await Consultation.findById(chatMessageData.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found', 404));
      }

      const isParticipant = consultation.patient_id.toString() === senderId.toString() || consultation.doctor_id.toString() === senderId.toString();
      if (!isParticipant && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not a participant of this consultation.', 403));
      }

      const newChatMessage = await ChatMessageService.createChatMessage(senderId.toString(), chatMessageData);
      res.status(201).json(new ApiResponse(201, toChatMessageResponseDto(newChatMessage), 'Chat message created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessages = await ChatMessageService.getAllChatMessages();
      res.status(200).json(new ApiResponse(200, chatMessages.map(toChatMessageResponseDto), 'Chat messages fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getChatMessageById(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessage = await ChatMessageService.getChatMessageById(req.params.id);

      // Ownership authorization: Check if the logged-in user is a participant or admin
      const consultation = await Consultation.findById(chatMessage?.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found for this message.', 404));
      }

      const isParticipant = consultation.patient_id.toString() === req.user?._id.toString() || consultation.doctor_id.toString() === req.user?._id.toString();
      if (!isParticipant && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access this chat message.', 403));
      }

      res.status(200).json(new ApiResponse(200, toChatMessageResponseDto(chatMessage!), 'Chat message fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getChatMessagesByConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.consultationId;

      // Ownership authorization: Check if the logged-in user is a participant or admin
      const consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        return next(new AppError('Consultation not found.', 404));
      }

      const isParticipant = consultation.patient_id.toString() === req.user?._id.toString() || consultation.doctor_id.toString() === req.user?._id.toString();
      if (!isParticipant && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to access chat messages for this consultation.', 403));
      }

      const chatMessages = await ChatMessageService.getChatMessagesByConsultation(consultationId);
      res.status(200).json(new ApiResponse(200, chatMessages.map(toChatMessageResponseDto), 'Chat messages for consultation fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessageData: UpdateChatMessageInput = req.body;
      const chatMessageId = req.params.id; // ID of the chat message to update

      // Get the chat message first to check ownership
      const existingChatMessage = await ChatMessageService.getChatMessageById(chatMessageId);
      if (!existingChatMessage) {
        return next(new AppError('Chat Message not found', 404));
      }

      // Ownership authorization: Check if the logged-in user is the sender or admin
      if (existingChatMessage.sender_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to update this chat message.', 403));
      }

      const updatedChatMessage = await ChatMessageService.updateChatMessage(chatMessageId, chatMessageData);
      res.status(200).json(new ApiResponse(200, toChatMessageResponseDto(updatedChatMessage!), 'Chat message updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteChatMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessageId = req.params.id; // ID of the chat message to delete

      // Get the chat message first to check ownership
      const existingChatMessage = await ChatMessageService.getChatMessageById(chatMessageId);
      if (!existingChatMessage) {
        return next(new AppError('Chat Message not found', 404));
      }

      // Ownership authorization: Check if the logged-in user is the sender or admin
      if (existingChatMessage.sender_id.toString() !== req.user?._id.toString() && !req.user?.roles?.includes('admin')) {
        return next(new AppError('You are not authorized to delete this chat message.', 403));
      }

      await ChatMessageService.deleteChatMessage(chatMessageId);
      res.status(204).json(new ApiResponse(204, null, 'Chat message deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatMessageController();
