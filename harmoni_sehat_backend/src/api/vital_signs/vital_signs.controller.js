const vitalSignsService = require('./vital_signs.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllVitalSigns = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const vitalSigns = await vitalSignsService.getAllVitalSigns({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(vitalSigns);
  } catch (error) {
    next(error);
  }
};

const getVitalSignsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vitalSigns = await vitalSignsService.getVitalSignsById(id);
    if (!vitalSigns) {
      throw new ApiError(404, 'Vital signs not found');
    }
    res.json(vitalSigns);
  } catch (error) {
    next(error);
  }
};

const createVitalSigns = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newVitalSigns = await vitalSignsService.createVitalSigns(req.body);
    res.status(201).json(newVitalSigns);
  } catch (error) {
    next(error);
  }
};

const updateVitalSigns = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedVitalSigns = await vitalSignsService.updateVitalSigns(id, req.body);
    if (!updatedVitalSigns) {
      throw new ApiError(404, 'Vital signs not found');
    }
    res.json(updatedVitalSigns);
  } catch (error) {
    next(error);
  }
};

const deleteVitalSigns = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await vitalSignsService.deleteVitalSigns(id);
    if (!deleted) {
      throw new ApiError(404, 'Vital signs not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVitalSigns,
  getVitalSignsById,
  createVitalSigns,
  updateVitalSigns,
  deleteVitalSigns,
};
