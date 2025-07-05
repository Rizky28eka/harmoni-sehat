const reviewRatingService = require('./review_rating.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllReviewRating = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const reviewRating = await reviewRatingService.getAllReviewRating({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(reviewRating);
  } catch (error) {
    next(error);
  }
};

const getReviewRatingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviewRating = await reviewRatingService.getReviewRatingById(id);
    if (!reviewRating) {
      throw new ApiError(404, 'Review rating not found');
    }
    res.json(reviewRating);
  } catch (error) {
    next(error);
  }
};

const createReviewRating = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newReviewRating = await reviewRatingService.createReviewRating(req.body);
    res.status(201).json(newReviewRating);
  } catch (error) {
    next(error);
  }
};

const updateReviewRating = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedReviewRating = await reviewRatingService.updateReviewRating(id, req.body);
    if (!updatedReviewRating) {
      throw new ApiError(404, 'Review rating not found');
    }
    res.json(updatedReviewRating);
  } catch (error) {
    next(error);
  }
};

const deleteReviewRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await reviewRatingService.deleteReviewRating(id);
    if (!deleted) {
      throw new ApiError(404, 'Review rating not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviewRating,
  getReviewRatingById,
  createReviewRating,
  updateReviewRating,
  deleteReviewRating,
};
