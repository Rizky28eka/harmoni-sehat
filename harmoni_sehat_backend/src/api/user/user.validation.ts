import { body } from 'express-validator';

export const createUserValidation = [
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .matches(/\d/).withMessage('Password harus mengandung angka')
    .matches(/[a-z]/).withMessage('Password harus mengandung huruf kecil')
    .matches(/[A-Z]/).withMessage('Password harus mengandung huruf besar')
    .matches(/[^\w]/).withMessage('Password harus mengandung karakter spesial'),
];

export const updateUserValidation = [
  body('email')
    .optional()
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .matches(/\d/).withMessage('Password harus mengandung angka')
    .matches(/[a-z]/).withMessage('Password harus mengandung huruf kecil')
    .matches(/[A-Z]/).withMessage('Password harus mengandung huruf besar')
    .matches(/[^\w]/).withMessage('Password harus mengandung karakter spesial'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active harus boolean'),
  body('role')
    .optional()
    .isMongoId().withMessage('Role ID tidak valid'),
];
