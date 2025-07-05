const kategoriArtikelService = require('./kategori_artikel.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKategoriArtikel = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const kategoriArtikel = await kategoriArtikelService.getAllKategoriArtikel({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(kategoriArtikel);
  } catch (error) {
    next(error);
  }
};

const getKategoriArtikelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kategoriArtikel = await kategoriArtikelService.getKategoriArtikelById(id);
    if (!kategoriArtikel) {
      throw new ApiError(404, 'Kategori artikel not found');
    }
    res.json(kategoriArtikel);
  } catch (error) {
    next(error);
  }
};

const createKategoriArtikel = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKategoriArtikel = await kategoriArtikelService.createKategoriArtikel(req.body);
    res.status(201).json(newKategoriArtikel);
  } catch (error) {
    next(error);
  }
};

const updateKategoriArtikel = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKategoriArtikel = await kategoriArtikelService.updateKategoriArtikel(id, req.body);
    if (!updatedKategoriArtikel) {
      throw new ApiError(404, 'Kategori artikel not found');
    }
    res.json(updatedKategoriArtikel);
  } catch (error) {
    next(error);
  }
};

const deleteKategoriArtikel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await kategoriArtikelService.deleteKategoriArtikel(id);
    if (!deleted) {
      throw new ApiError(404, 'Kategori artikel not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKategoriArtikel,
  getKategoriArtikelById,
  createKategoriArtikel,
  updateKategoriArtikel,
  deleteKategoriArtikel,
};
