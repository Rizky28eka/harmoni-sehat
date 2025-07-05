const artikelKesehatanService = require('./artikel_kesehatan.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllArtikelKesehatan = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const artikelKesehatan = await artikelKesehatanService.getAllArtikelKesehatan({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(artikelKesehatan);
  } catch (error) {
    next(error);
  }
};

const getArtikelKesehatanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artikelKesehatan = await artikelKesehatanService.getArtikelKesehatanById(id);
    if (!artikelKesehatan) {
      throw new ApiError(404, 'Artikel kesehatan not found');
    }
    res.json(artikelKesehatan);
  } catch (error) {
    next(error);
  }
};

const createArtikelKesehatan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newArtikelKesehatan = await artikelKesehatanService.createArtikelKesehatan(req.body);
    res.status(201).json(newArtikelKesehatan);
  } catch (error) {
    next(error);
  }
};

const updateArtikelKesehatan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedArtikelKesehatan = await artikelKesehatanService.updateArtikelKesehatan(id, req.body);
    if (!updatedArtikelKesehatan) {
      throw new ApiError(404, 'Artikel kesehatan not found');
    }
    res.json(updatedArtikelKesehatan);
  } catch (error) {
    next(error);
  }
};

const deleteArtikelKesehatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await artikelKesehatanService.deleteArtikelKesehatan(id);
    if (!deleted) {
      throw new ApiError(404, 'Artikel kesehatan not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtikelKesehatan,
  getArtikelKesehatanById,
  createArtikelKesehatan,
  updateArtikelKesehatan,
  deleteArtikelKesehatan,
};
