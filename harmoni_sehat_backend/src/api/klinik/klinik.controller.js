const klinikService = require('./klinik.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKlinik = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const klinik = await klinikService.getAllKlinik({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(klinik);
  } catch (error) {
    next(error);
  }
};

const getKlinikById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const klinik = await klinikService.getKlinikById(id);
    if (!klinik) {
      throw new ApiError(404, 'Klinik not found');
    }
    res.json(klinik);
  } catch (error) {
    next(error);
  }
};

const createKlinik = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKlinik = await klinikService.createKlinik(req.body);
    res.status(201).json(newKlinik);
  } catch (error) {
    next(error);
  }
};

const updateKlinik = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKlinik = await klinikService.updateKlinik(id, req.body);
    if (!updatedKlinik) {
      throw new ApiError(404, 'Klinik not found');
    }
    res.json(updatedKlinik);
  } catch (error) {
    next(error);
  }
};

const deleteKlinik = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await klinikService.deleteKlinik(id);
    if (!deleted) {
      throw new ApiError(404, 'Klinik not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKlinik,
  getKlinikById,
  createKlinik,
  updateKlinik,
  deleteKlinik,
};
