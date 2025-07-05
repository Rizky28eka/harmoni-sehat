const { body } = require('express-validator');

const createChatMessagesValidation = [
  body('konsultasi_id').isInt().withMessage('Konsultasi ID must be an integer'),
  body('sender_id').isInt().withMessage('Sender ID must be an integer'),
  body('message_text').optional().isString().withMessage('Message text must be a string'),
  body('message_type').isIn(['text', 'image', 'file', 'voice', 'video']).withMessage('Invalid message type'),
  body('file_path').optional().isString().withMessage('File path must be a string'),
  body('file_size').optional().isInt().withMessage('File size must be an integer'),
  body('is_read').optional().isBoolean().withMessage('Is_read must be a boolean'),
  body('is_edited').optional().isBoolean().withMessage('Is_edited must be a boolean'),
  body('reply_to_message_id').optional().isInt().withMessage('Reply to message ID must be an integer'),
];

const updateChatMessagesValidation = [
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('sender_id').optional().isInt().withMessage('Sender ID must be an integer'),
  body('message_text').optional().isString().withMessage('Message text must be a string'),
  body('message_type').optional().isIn(['text', 'image', 'file', 'voice', 'video']).withMessage('Invalid message type'),
  body('file_path').optional().isString().withMessage('File path must be a string'),
  body('file_size').optional().isInt().withMessage('File size must be an integer'),
  body('is_read').optional().isBoolean().withMessage('Is_read must be a boolean'),
  body('is_edited').optional().isBoolean().withMessage('Is_edited must be a boolean'),
  body('reply_to_message_id').optional().isInt().withMessage('Reply to message ID must be an integer'),
];

module.exports = {
  createChatMessagesValidation,
  updateChatMessagesValidation,
};
