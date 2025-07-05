const express = require('express');
const router = express.Router();
const reviewRatingController = require('./review_rating.controller');
const { createReviewRatingValidation, updateReviewRatingValidation } = require('./review_rating.validation');

router.get('/', reviewRatingController.getAllReviewRating);
router.get('/:id', reviewRatingController.getReviewRatingById);
router.post('/', createReviewRatingValidation, reviewRatingController.createReviewRating);
router.put('/:id', updateReviewRatingValidation, reviewRatingController.updateReviewRating);
router.delete('/:id', reviewRatingController.deleteReviewRating);

module.exports = router;
