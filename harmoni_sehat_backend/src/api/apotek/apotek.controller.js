const apotekService = require('./apotek.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllApotek = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const apotek = await apotekService.getAllApotek({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(apotek);
  } catch (error) {
    next(error);
  }
};

const getApotekById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apotek = await apotekService.getApotekById(id);
    if (!apotek) {
      throw new ApiError(404, 'Apotek not found');
    }
    res.json(apotek);
  } catch (error) {
    next(error);
  }
};

const createApotek = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newApotek = await apotekService.createApotek(req.body);
    res.status(201).json(newApotek);
  } catch (error) {
    next(error);
  }
};

const updateApotek = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedApotek = await apotekService.updateApotek(id, req.body);
    if (!updatedApotek) {
      throw new ApiError(404, 'Apotek not found');
    }
    res.json(updatedApotek);
  } catch (error) {
    next(error);
  }
};

const deleteApotek = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await apotekService.deleteApotek(id);
    if (!deleted) {
      throw new ApiError(404, 'Apotek not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getApotekApoteker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const apoteker = await apotekService.getApotekApoteker(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(apoteker);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApotek,
  getApotekById,
  createApotek,
  updateApotek,
  deleteApotek,
  getApotekApoteker,
};
