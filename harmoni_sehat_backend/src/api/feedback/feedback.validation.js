const { body } = require('express-validator');

const createFeedbackValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('tipe_feedback').isIn(['bug', 'suggestion', 'complaint', 'praise']).withMessage('Invalid tipe feedback'),
  body('judul').optional().isString().withMessage('Judul must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('screenshot').optional().isString().withMessage('Screenshot must be a string'),
  body('status').isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
];

const updateFeedbackValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('tipe_feedback').optional().isIn(['bug', 'suggestion', 'complaint', 'praise']).withMessage('Invalid tipe feedback'),
  body('judul').optional().isString().withMessage('Judul must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('screenshot').optional().isString().withMessage('Screenshot must be a string'),
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
];

module.exports = {
  createFeedbackValidation,
  updateFeedbackValidation,
};
