const { body } = require('express-validator');

const createReviewRatingValidation = [
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('reviewer_id').isInt().withMessage('Reviewer ID must be an integer'),
  body('reviewed_id').isInt().withMessage('Reviewed ID must be an integer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('review_text').optional().isString().withMessage('Review text must be a string'),
  body('review_type').isIn(['doctor', 'apotek', 'kurir', 'aplikasi']).withMessage('Invalid review type'),
  body('is_anonymous').optional().isBoolean().withMessage('Is_anonymous must be a boolean'),
];

const updateReviewRatingValidation = [
  body('konsultasi_id').optional().isInt().withMessage('Konsultasi ID must be an integer'),
  body('reviewer_id').optional().isInt().withMessage('Reviewer ID must be an integer'),
  body('reviewed_id').optional().isInt().withMessage('Reviewed ID must be an integer'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('review_text').optional().isString().withMessage('Review text must be a string'),
  body('review_type').optional().isIn(['doctor', 'apotek', 'kurir', 'aplikasi']).withMessage('Invalid review type'),
  body('is_anonymous').optional().isBoolean().withMessage('Is_anonymous must be a boolean'),
];

module.exports = {
  createReviewRatingValidation,
  updateReviewRatingValidation,
};
