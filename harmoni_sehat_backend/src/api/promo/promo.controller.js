const promoService = require('./promo.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllPromo = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const promo = await promoService.getAllPromo({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(promo);
  } catch (error) {
    next(error);
  }
};

const getPromoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const promo = await promoService.getPromoById(id);
    if (!promo) {
      throw new ApiError(404, 'Promo not found');
    }
    res.json(promo);
  } catch (error) {
    next(error);
  }
};

const createPromo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newPromo = await promoService.createPromo(req.body);
    res.status(201).json(newPromo);
  } catch (error) {
    next(error);
  }
};

const updatePromo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedPromo = await promoService.updatePromo(id, req.body);
    if (!updatedPromo) {
      throw new ApiError(404, 'Promo not found');
    }
    res.json(updatedPromo);
  } catch (error) {
    next(error);
  }
};

const deletePromo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await promoService.deletePromo(id);
    if (!deleted) {
      throw new ApiError(404, 'Promo not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPromo,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo,
};
