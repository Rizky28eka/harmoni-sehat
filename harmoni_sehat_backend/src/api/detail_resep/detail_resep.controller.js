const detailResepService = require('./detail_resep.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllDetailResep = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const detailResep = await detailResepService.getAllDetailResep({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(detailResep);
  } catch (error) {
    next(error);
  }
};

const getDetailResepById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const detailResep = await detailResepService.getDetailResepById(id);
    if (!detailResep) {
      throw new ApiError(404, 'Detail resep not found');
    }
    res.json(detailResep);
  } catch (error) {
    next(error);
  }
};

const createDetailResep = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newDetailResep = await detailResepService.createDetailResep(req.body);
    res.status(201).json(newDetailResep);
  } catch (error) {
    next(error);
  }
};

const updateDetailResep = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedDetailResep = await detailResepService.updateDetailResep(id, req.body);
    if (!updatedDetailResep) {
      throw new ApiError(404, 'Detail resep not found');
    }
    res.json(updatedDetailResep);
  } catch (error) {
    next(error);
  }
};

const deleteDetailResep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await detailResepService.deleteDetailResep(id);
    if (!deleted) {
      throw new ApiError(404, 'Detail resep not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailResep,
  getDetailResepById,
  createDetailResep,
  updateDetailResep,
  deleteDetailResep,
};
