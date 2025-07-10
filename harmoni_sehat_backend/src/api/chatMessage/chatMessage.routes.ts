import { Router } from 'express';
import chatMessageController from './chatMessage.controller';
import { validate } from '../../middlewares/validator';
import { createChatMessageSchema, updateChatMessageSchema } from './chatMessage.validation';

const router = Router();

router.route('/')
  .post(validate(createChatMessageSchema), chatMessageController.createChatMessage)
  .get(chatMessageController.getAllChatMessages);

router.route('/:id')
  .get(chatMessageController.getChatMessageById)
  .put(validate(updateChatMessageSchema), chatMessageController.updateChatMessage)
  .delete(chatMessageController.deleteChatMessage);

export default router;