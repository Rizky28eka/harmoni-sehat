const stokObatService = require('./stok_obat.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllStokObat = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const stokObat = await stokObatService.getAllStokObat({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(stokObat);
  } catch (error) {
    next(error);
  }
};

const getStokObatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stokObat = await stokObatService.getStokObatById(id);
    if (!stokObat) {
      throw new ApiError(404, 'Stok obat not found');
    }
    res.json(stokObat);
  } catch (error) {
    next(error);
  }
};

const createStokObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newStokObat = await stokObatService.createStokObat(req.body);
    res.status(201).json(newStokObat);
  } catch (error) {
    next(error);
  }
};

const updateStokObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedStokObat = await stokObatService.updateStokObat(id, req.body);
    if (!updatedStokObat) {
      throw new ApiError(404, 'Stok obat not found');
    }
    res.json(updatedStokObat);
  } catch (error) {
    next(error);
  }
};

const deleteStokObat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await stokObatService.deleteStokObat(id);
    if (!deleted) {
      throw new ApiError(404, 'Stok obat not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStokObat,
  getStokObatById,
  createStokObat,
  updateStokObat,
  deleteStokObat,
};
