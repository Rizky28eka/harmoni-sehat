const pembayaranService = require('./payment.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllPembayaran = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const pembayaran = await pembayaranService.getAllPembayaran({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(pembayaran);
  } catch (error) {
    next(error);
  }
};

const getPembayaranById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembayaran = await pembayaranService.getPembayaranById(id);
    if (!pembayaran) {
      throw new ApiError(404, 'Pembayaran not found');
    }
    res.json(pembayaran);
  } catch (error) {
    next(error);
  }
};

const createPembayaran = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newPembayaran = await pembayaranService.createPembayaran(req.body);
    res.status(201).json(newPembayaran);
  } catch (error) {
    next(error);
  }
};

const updatePembayaran = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedPembayaran = await pembayaranService.updatePembayaran(id, req.body);
    if (!updatedPembayaran) {
      throw new ApiError(404, 'Pembayaran not found');
    }
    res.json(updatedPembayaran);
  } catch (error) {
    next(error);
  }
};

const deletePembayaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await pembayaranService.deletePembayaran(id);
    if (!deleted) {
      throw new ApiError(404, 'Pembayaran not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
};