const feedbackService = require('./feedback.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllFeedback = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const feedback = await feedbackService.getAllFeedback({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackService.getFeedbackById(id);
    if (!feedback) {
      throw new ApiError(404, 'Feedback not found');
    }
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newFeedback = await feedbackService.createFeedback(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedFeedback = await feedbackService.updateFeedback(id, req.body);
    if (!updatedFeedback) {
      throw new ApiError(404, 'Feedback not found');
    }
    res.json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await feedbackService.deleteFeedback(id);
    if (!deleted) {
      throw new ApiError(404, 'Feedback not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
