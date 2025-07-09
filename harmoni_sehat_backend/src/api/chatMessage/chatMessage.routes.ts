import { Router } from 'express';
import ChatMessageController from './chatMessage.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createChatMessageSchema, updateChatMessageSchema } from './chatMessage.validation';

const router = Router();

// All chat message routes are protected
router.use(protect);

// Routes for creating and getting messages within a consultation
router.post('/', authorize('patient', 'doctor', 'admin'), validate(createChatMessageSchema), ChatMessageController.createChatMessage);
router.get('/consultation/:consultationId', authorize('patient', 'doctor', 'admin'), ChatMessageController.getChatMessagesByConsultation);

// Routes for admin to get all messages (potentially for auditing)
router.get('/', authorize('admin'), ChatMessageController.getAllChatMessages);

// Routes for specific chat message by ID
router.get('/:id', authorize('patient', 'doctor', 'admin'), ChatMessageController.getChatMessageById);
router.put('/:id', authorize('patient', 'doctor', 'admin'), validate(updateChatMessageSchema), ChatMessageController.updateChatMessage);
router.delete('/:id', authorize('patient', 'doctor', 'admin'), ChatMessageController.deleteChatMessage);

export default router;
