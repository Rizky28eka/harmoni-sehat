const { body } = require('express-validator');

const createFaqValidation = [
  body('pertanyaan').notEmpty().withMessage('Pertanyaan is required').isString().withMessage('Pertanyaan must be a string'),
  body('jawaban').notEmpty().withMessage('Jawaban is required').isString().withMessage('Jawaban must be a string'),
  body('kategori').optional().isString().withMessage('Kategori must be a string'),
  body('urutan').optional().isInt().withMessage('Urutan must be an integer'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('views').optional().isInt().withMessage('Views must be an integer'),
];

const updateFaqValidation = [
  body('pertanyaan').optional().notEmpty().withMessage('Pertanyaan is required').isString().withMessage('Pertanyaan must be a string'),
  body('jawaban').optional().notEmpty().withMessage('Jawaban is required').isString().withMessage('Jawaban must be a string'),
  body('kategori').optional().isString().withMessage('Kategori must be a string'),
  body('urutan').optional().isInt().withMessage('Urutan must be an integer'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
  body('views').optional().isInt().withMessage('Views must be an integer'),
];

module.exports = {
  createFaqValidation,
  updateFaqValidation,
};
