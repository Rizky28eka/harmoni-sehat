const kurirService = require('./kurir.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKurir = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const kurir = await kurirService.getAllKurir({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(kurir);
  } catch (error) {
    next(error);
  }
};

const getKurirById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kurir = await kurirService.getKurirById(id);
    if (!kurir) {
      throw new ApiError(404, 'Kurir not found');
    }
    res.json(kurir);
  } catch (error) {
    next(error);
  }
};

const createKurir = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKurir = await kurirService.createKurir(req.body);
    res.status(201).json(newKurir);
  } catch (error) {
    next(error);
  }
};

const updateKurir = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKurir = await kurirService.updateKurir(id, req.body);
    if (!updatedKurir) {
      throw new ApiError(404, 'Kurir not found');
    }
    res.json(updatedKurir);
  } catch (error) {
    next(error);
  }
};

const deleteKurir = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await kurirService.deleteKurir(id);
    if (!deleted) {
      throw new ApiError(404, 'Kurir not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKurir,
  getKurirById,
  createKurir,
  updateKurir,
  deleteKurir,
};
