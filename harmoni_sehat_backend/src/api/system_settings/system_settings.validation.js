const { body } = require('express-validator');

const createSystemSettingsValidation = [
  body('setting_key').notEmpty().withMessage('Setting key is required').isString().withMessage('Setting key must be a string'),
  body('setting_value').optional().isString().withMessage('Setting value must be a string'),
  body('setting_type').isIn(['string', 'number', 'boolean', 'json']).withMessage('Invalid setting type'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('is_public').optional().isBoolean().withMessage('Is_public must be a boolean'),
];

const updateSystemSettingsValidation = [
  body('setting_key').optional().notEmpty().withMessage('Setting key is required').isString().withMessage('Setting key must be a string'),
  body('setting_value').optional().isString().withMessage('Setting value must be a string'),
  body('setting_type').optional().isIn(['string', 'number', 'boolean', 'json']).withMessage('Invalid setting type'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('is_public').optional().isBoolean().withMessage('Is_public must be a boolean'),
];

module.exports = {
  createSystemSettingsValidation,
  updateSystemSettingsValidation,
};
