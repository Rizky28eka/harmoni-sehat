const { body } = require('express-validator');

const createLogsValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('action').notEmpty().withMessage('Action is required').isString().withMessage('Action must be a string'),
  body('table_name').optional().isString().withMessage('Table name must be a string'),
  body('record_id').optional().isInt().withMessage('Record ID must be an integer'),
  body('old_data').optional().isString().withMessage('Old data must be a string'),
  body('new_data').optional().isString().withMessage('New data must be a string'),
  body('ip_address').optional().isString().withMessage('IP address must be a string'),
  body('user_agent').optional().isString().withMessage('User agent must be a string'),
];

const updateLogsValidation = [
  body('user_id').optional().isInt().withMessage('User ID must be an integer'),
  body('action').optional().notEmpty().withMessage('Action is required').isString().withMessage('Action must be a string'),
  body('table_name').optional().isString().withMessage('Table name must be a string'),
  body('record_id').optional().isInt().withMessage('Record ID must be an integer'),
  body('old_data').optional().isString().withMessage('Old data must be a string'),
  body('new_data').optional().isString().withMessage('New data must be a string'),
  body('ip_address').optional().isString().withMessage('IP address must be a string'),
  body('user_agent').optional().isString().withMessage('User agent must be a string'),
];

module.exports = {
  createLogsValidation,
  updateLogsValidation,
};
