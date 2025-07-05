const notifikasiService = require('./notifikasi.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllNotifikasi = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const notifikasi = await notifikasiService.getAllNotifikasi({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(notifikasi);
  } catch (error) {
    next(error);
  }
};

const getNotifikasiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notifikasi = await notifikasiService.getNotifikasiById(id);
    if (!notifikasi) {
      throw new ApiError(404, 'Notifikasi not found');
    }
    res.json(notifikasi);
  } catch (error) {
    next(error);
  }
};

const createNotifikasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newNotifikasi = await notifikasiService.createNotifikasi(req.body);
    res.status(201).json(newNotifikasi);
  } catch (error) {
    next(error);
  }
};

const updateNotifikasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedNotifikasi = await notifikasiService.updateNotifikasi(id, req.body);
    if (!updatedNotifikasi) {
      throw new ApiError(404, 'Notifikasi not found');
    }
    res.json(updatedNotifikasi);
  } catch (error) {
    next(error);
  }
};

const deleteNotifikasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await notifikasiService.deleteNotifikasi(id);
    if (!deleted) {
      throw new ApiError(404, 'Notifikasi not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotifikasi,
  getNotifikasiById,
  createNotifikasi,
  updateNotifikasi,
  deleteNotifikasi,
};
