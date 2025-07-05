const resepService = require('./resep.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllResep = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const resep = await resepService.getAllResep({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(resep);
  } catch (error) {
    next(error);
  }
};

const getResepById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resep = await resepService.getResepById(id);
    if (!resep) {
      throw new ApiError(404, 'Resep not found');
    }
    res.json(resep);
  } catch (error) {
    next(error);
  }
};

const createResep = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newResep = await resepService.createResep(req.body);
    res.status(201).json(newResep);
  } catch (error) {
    next(error);
  }
};

const updateResep = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedResep = await resepService.updateResep(id, req.body);
    if (!updatedResep) {
      throw new ApiError(404, 'Resep not found');
    }
    res.json(updatedResep);
  } catch (error) {
    next(error);
  }
};

const deleteResep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await resepService.deleteResep(id);
    if (!deleted) {
      throw new ApiError(404, 'Resep not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getResepDetailResep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const detailResep = await resepService.getResepDetailResep(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(detailResep);
  } catch (error) {
    next(error);
  }
};

const getResepPembayaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembayaran = await resepService.getResepPembayaran(id);
    if (!pembayaran) {
      throw new ApiError(404, 'Pembayaran not found for this resep');
    }
    res.json(pembayaran);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllResep,
  getResepById,
  createResep,
  updateResep,
  deleteResep,
  getResepDetailResep,
  getResepPembayaran,
};
