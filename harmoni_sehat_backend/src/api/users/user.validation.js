const { body } = require('express-validator');

const createUserValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password_hash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['pasien', 'doctor', 'apoteker', 'admin']).withMessage('Invalid role'),
];

const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('password_hash').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['pasien', 'doctor', 'apoteker', 'admin']).withMessage('Invalid role'),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
};
