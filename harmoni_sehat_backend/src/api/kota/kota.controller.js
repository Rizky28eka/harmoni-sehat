const kotaService = require('./kota.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKota = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const kota = await kotaService.getAllKota({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(kota);
  } catch (error) {
    next(error);
  }
};

const getKotaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kota = await kotaService.getKotaById(id);
    if (!kota) {
      throw new ApiError(404, 'Kota not found');
    }
    res.json(kota);
  } catch (error) {
    next(error);
  }
};

const createKota = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKota = await kotaService.createKota(req.body);
    res.status(201).json(newKota);
  } catch (error) {
    next(error);
  }
};

const updateKota = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKota = await kotaService.updateKota(id, req.body);
    if (!updatedKota) {
      throw new ApiError(404, 'Kota not found');
    }
    res.json(updatedKota);
  } catch (error) {
    next(error);
  }
};

const deleteKota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await kotaService.deleteKota(id);
    if (!deleted) {
      throw new ApiError(404, 'Kota not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKota,
  getKotaById,
  createKota,
  updateKota,
  deleteKota,
};
