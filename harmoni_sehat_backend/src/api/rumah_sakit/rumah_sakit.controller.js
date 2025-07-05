const rumahSakitService = require('./rumah_sakit.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllRumahSakit = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const rumahSakit = await rumahSakitService.getAllRumahSakit({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(rumahSakit);
  } catch (error) {
    next(error);
  }
};

const getRumahSakitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rumahSakit = await rumahSakitService.getRumahSakitById(id);
    if (!rumahSakit) {
      throw new ApiError(404, 'Rumah sakit not found');
    }
    res.json(rumahSakit);
  } catch (error) {
    next(error);
  }
};

const createRumahSakit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newRumahSakit = await rumahSakitService.createRumahSakit(req.body);
    res.status(201).json(newRumahSakit);
  } catch (error) {
    next(error);
  }
};

const updateRumahSakit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedRumahSakit = await rumahSakitService.updateRumahSakit(id, req.body);
    if (!updatedRumahSakit) {
      throw new ApiError(404, 'Rumah sakit not found');
    }
    res.json(updatedRumahSakit);
  } catch (error) {
    next(error);
  }
};

const deleteRumahSakit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await rumahSakitService.deleteRumahSakit(id);
    if (!deleted) {
      throw new ApiError(404, 'Rumah sakit not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRumahSakit,
  getRumahSakitById,
  createRumahSakit,
  updateRumahSakit,
  deleteRumahSakit,
};
