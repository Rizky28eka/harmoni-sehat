const apotekerService = require('./apoteker.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllApoteker = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const apoteker = await apotekerService.getAllApoteker({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(apoteker);
  } catch (error) {
    next(error);
  }
};

const getApotekerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apoteker = await apotekerService.getApotekerById(id);
    if (!apoteker) {
      throw new ApiError(404, 'Apoteker not found');
    }
    res.json(apoteker);
  } catch (error) {
    next(error);
  }
};

const createApoteker = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newApoteker = await apotekerService.createApoteker(req.body);
    res.status(201).json(newApoteker);
  } catch (error) {
    next(error);
  }
};

const updateApoteker = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedApoteker = await apotekerService.updateApoteker(id, req.body);
    if (!updatedApoteker) {
      throw new ApiError(404, 'Apoteker not found');
    }
    res.json(updatedApoteker);
  } catch (error) {
    next(error);
  }
};

const deleteApoteker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await apotekerService.deleteApoteker(id);
    if (!deleted) {
      throw new ApiError(404, 'Apoteker not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApoteker,
  getApotekerById,
  createApoteker,
  updateApoteker,
  deleteApoteker,
};
