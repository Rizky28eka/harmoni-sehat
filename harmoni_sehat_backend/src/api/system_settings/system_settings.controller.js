const systemSettingsService = require('./system_settings.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllSystemSettings = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const settings = await systemSettingsService.getAllSystemSettings({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const getSystemSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const settings = await systemSettingsService.getSystemSettingsById(id);
    if (!settings) {
      throw new ApiError(404, 'System settings not found');
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const createSystemSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newSettings = await systemSettingsService.createSystemSettings(req.body);
    res.status(201).json(newSettings);
  } catch (error) {
    next(error);
  }
};

const updateSystemSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedSettings = await systemSettingsService.updateSystemSettings(id, req.body);
    if (!updatedSettings) {
      throw new ApiError(404, 'System settings not found');
    }
    res.json(updatedSettings);
  } catch (error) {
    next(error);
  }
};

const deleteSystemSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await systemSettingsService.deleteSystemSettings(id);
    if (!deleted) {
      throw new ApiError(404, 'System settings not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSystemSettings,
  getSystemSettingsById,
  createSystemSettings,
  updateSystemSettings,
  deleteSystemSettings,
};
