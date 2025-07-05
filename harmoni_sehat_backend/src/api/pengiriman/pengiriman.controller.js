const pengirimanService = require('./pengiriman.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllPengiriman = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const pengiriman = await pengirimanService.getAllPengiriman({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(pengiriman);
  } catch (error) {
    next(error);
  }
};

const getPengirimanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pengiriman = await pengirimanService.getPengirimanById(id);
    if (!pengiriman) {
      throw new ApiError(404, 'Pengiriman not found');
    }
    res.json(pengiriman);
  } catch (error) {
    next(error);
  }
};

const createPengiriman = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newPengiriman = await pengirimanService.createPengiriman(req.body);
    res.status(201).json(newPengiriman);
  } catch (error) {
    next(error);
  }
};

const updatePengiriman = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedPengiriman = await pengirimanService.updatePengiriman(id, req.body);
    if (!updatedPengiriman) {
      throw new ApiError(404, 'Pengiriman not found');
    }
    res.json(updatedPengiriman);
  } catch (error) {
    next(error);
  }
};

const deletePengiriman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await pengirimanService.deletePengiriman(id);
    if (!deleted) {
      throw new ApiError(404, 'Pengiriman not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPengiriman,
  getPengirimanById,
  createPengiriman,
  updatePengiriman,
  deletePengiriman,
};
