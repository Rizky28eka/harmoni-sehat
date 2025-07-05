const logsService = require('./logs.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllLogs = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const logs = await logsService.getAllLogs({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getLogsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logs = await logsService.getLogsById(id);
    if (!logs) {
      throw new ApiError(404, 'Log not found');
    }
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const createLogs = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newLogs = await logsService.createLogs(req.body);
    res.status(201).json(newLogs);
  } catch (error) {
    next(error);
  }
};

const updateLogs = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedLogs = await logsService.updateLogs(id, req.body);
    if (!updatedLogs) {
      throw new ApiError(404, 'Log not found');
    }
    res.json(updatedLogs);
  } catch (error) {
    next(error);
  }
};

const deleteLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await logsService.deleteLogs(id);
    if (!deleted) {
      throw new ApiError(404, 'Log not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLogs,
  getLogsById,
  createLogs,
  updateLogs,
  deleteLogs,
};
