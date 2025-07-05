const obatService = require('./obat.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllObat = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const obat = await obatService.getAllObat({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(obat);
  } catch (error) {
    next(error);
  }
};

const getObatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const obat = await obatService.getObatById(id);
    if (!obat) {
      throw new ApiError(404, 'Obat not found');
    }
    res.json(obat);
  } catch (error) {
    next(error);
  }
};

const createObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newObat = await obatService.createObat(req.body);
    res.status(201).json(newObat);
  } catch (error) {
    next(error);
  }
};

const updateObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedObat = await obatService.updateObat(id, req.body);
    if (!updatedObat) {
      throw new ApiError(404, 'Obat not found');
    }
    res.json(updatedObat);
  } catch (error) {
    next(error);
  }
};

const deleteObat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await obatService.deleteObat(id);
    if (!deleted) {
      throw new ApiError(404, 'Obat not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllObat,
  getObatById,
  createObat,
  updateObat,
  deleteObat,
};
