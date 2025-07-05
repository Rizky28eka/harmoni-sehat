const provinsiService = require('./provinsi.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllProvinsi = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const provinsi = await provinsiService.getAllProvinsi({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(provinsi);
  } catch (error) {
    next(error);
  }
};

const getProvinsiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provinsi = await provinsiService.getProvinsiById(id);
    if (!provinsi) {
      throw new ApiError(404, 'Provinsi not found');
    }
    res.json(provinsi);
  } catch (error) {
    next(error);
  }
};

const createProvinsi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newProvinsi = await provinsiService.createProvinsi(req.body);
    res.status(201).json(newProvinsi);
  } catch (error) {
    next(error);
  }
};

const updateProvinsi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedProvinsi = await provinsiService.updateProvinsi(id, req.body);
    if (!updatedProvinsi) {
      throw new ApiError(404, 'Provinsi not found');
    }
    res.json(updatedProvinsi);
  } catch (error) {
    next(error);
  }
};

const deleteProvinsi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await provinsiService.deleteProvinsi(id);
    if (!deleted) {
      throw new ApiError(404, 'Provinsi not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getProvinsiKota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const kota = await provinsiService.getProvinsiKota(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(kota);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProvinsi,
  getProvinsiById,
  createProvinsi,
  updateProvinsi,
  deleteProvinsi,
  getProvinsiKota,
};
