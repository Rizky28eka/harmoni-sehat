const chatMessagesService = require('./chat_messages.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllChatMessages = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const chatMessages = await chatMessagesService.getAllChatMessages({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(chatMessages);
  } catch (error) {
    next(error);
  }
};

const getChatMessagesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chatMessages = await chatMessagesService.getChatMessagesById(id);
    if (!chatMessages) {
      throw new ApiError(404, 'Chat message not found');
    }
    res.json(chatMessages);
  } catch (error) {
    next(error);
  }
};

const createChatMessages = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newChatMessages = await chatMessagesService.createChatMessages(req.body);
    res.status(201).json(newChatMessages);
  } catch (error) {
    next(error);
  }
};

const updateChatMessages = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedChatMessages = await chatMessagesService.updateChatMessages(id, req.body);
    if (!updatedChatMessages) {
      throw new ApiError(404, 'Chat message not found');
    }
    res.json(updatedChatMessages);
  } catch (error) {
    next(error);
  }
};

const deleteChatMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await chatMessagesService.deleteChatMessages(id);
    if (!deleted) {
      throw new ApiError(404, 'Chat message not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChatMessages,
  getChatMessagesById,
  createChatMessages,
  updateChatMessages,
  deleteChatMessages,
};
