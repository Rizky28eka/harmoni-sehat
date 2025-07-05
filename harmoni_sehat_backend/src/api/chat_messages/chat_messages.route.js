const express = require('express');
const router = express.Router();
const chatMessagesController = require('./chat_messages.controller');
const { createChatMessagesValidation, updateChatMessagesValidation } = require('./chat_messages.validation');

router.get('/', chatMessagesController.getAllChatMessages);
router.get('/:id', chatMessagesController.getChatMessagesById);
router.post('/', createChatMessagesValidation, chatMessagesController.createChatMessages);
router.put('/:id', updateChatMessagesValidation, chatMessagesController.updateChatMessages);
router.delete('/:id', chatMessagesController.deleteChatMessages);

module.exports = router;
