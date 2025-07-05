const kategoriObatService = require('./kategori_obat.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKategoriObat = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const kategoriObat = await kategoriObatService.getAllKategoriObat({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(kategoriObat);
  } catch (error) {
    next(error);
  }
};

const getKategoriObatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kategoriObat = await kategoriObatService.getKategoriObatById(id);
    if (!kategoriObat) {
      throw new ApiError(404, 'Kategori obat not found');
    }
    res.json(kategoriObat);
  } catch (error) {
    next(error);
  }
};

const createKategoriObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKategoriObat = await kategoriObatService.createKategoriObat(req.body);
    res.status(201).json(newKategoriObat);
  } catch (error) {
    next(error);
  }
};

const updateKategoriObat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKategoriObat = await kategoriObatService.updateKategoriObat(id, req.body);
    if (!updatedKategoriObat) {
      throw new ApiError(404, 'Kategori obat not found');
    }
    res.json(updatedKategoriObat);
  } catch (error) {
    next(error);
  }
};

const deleteKategoriObat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await kategoriObatService.deleteKategoriObat(id);
    if (!deleted) {
      throw new ApiError(404, 'Kategori obat not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKategoriObat,
  getKategoriObatById,
  createKategoriObat,
  updateKategoriObat,
  deleteKategoriObat,
};
