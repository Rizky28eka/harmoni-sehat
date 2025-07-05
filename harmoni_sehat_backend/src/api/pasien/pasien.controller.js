const pasienService = require('./pasien.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllPasien = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const pasien = await pasienService.getAllPasien({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(pasien);
  } catch (error) {
    next(error);
  }
};

const getPasienById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pasien = await pasienService.getPasienById(id);
    if (!pasien) {
      throw new ApiError(404, 'Pasien not found');
    }
    res.json(pasien);
  } catch (error) {
    next(error);
  }
};

const createPasien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newPasien = await pasienService.createPasien(req.body);
    res.status(201).json(newPasien);
  } catch (error) {
    next(error);
  }
};

const updatePasien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedPasien = await pasienService.updatePasien(id, req.body);
    if (!updatedPasien) {
      throw new ApiError(404, 'Pasien not found');
    }
    res.json(updatedPasien);
  } catch (error) {
    next(error);
  }
};

const deletePasien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await pasienService.deletePasien(id);
    if (!deleted) {
      throw new ApiError(404, 'Pasien not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getPasienKonsultasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const konsultasi = await pasienService.getPasienKonsultasi(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(konsultasi);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getPasienKonsultasi,
};
