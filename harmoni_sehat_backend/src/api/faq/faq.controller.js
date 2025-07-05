const faqService = require('./faq.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllFaq = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const faq = await faqService.getAllFaq({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(faq);
  } catch (error) {
    next(error);
  }
};

const getFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await faqService.getFaqById(id);
    if (!faq) {
      throw new ApiError(404, 'FAQ not found');
    }
    res.json(faq);
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newFaq = await faqService.createFaq(req.body);
    res.status(201).json(newFaq);
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedFaq = await faqService.updateFaq(id, req.body);
    if (!updatedFaq) {
      throw new ApiError(404, 'FAQ not found');
    }
    res.json(updatedFaq);
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await faqService.deleteFaq(id);
    if (!deleted) {
      throw new ApiError(404, 'FAQ not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFaq,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
