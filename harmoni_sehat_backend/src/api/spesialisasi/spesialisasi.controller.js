
const spesialisasiService = require('./spesialisasi.service');
const { validationResult } = require('express-validator');

const getAllSpesialisasi = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const spesialisasi = await spesialisasiService.getAllSpesialisasi({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(spesialisasi);
  } catch (error) {
    next(error);
  }
};

const getSpesialisasiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const spesialisasi = await spesialisasiService.getSpesialisasiById(id);
    if (!spesialisasi) {
      return res.status(404).json({ message: 'Spesialisasi not found' });
    }
    res.json(spesialisasi);
  } catch (error) {
    next(error);
  }
};

const createSpesialisasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newSpesialisasi = await spesialisasiService.createSpesialisasi(req.body);
    res.status(201).json(newSpesialisasi);
  } catch (error) {
    next(error);
  }
};

const updateSpesialisasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const updatedSpesialisasi = await spesialisasiService.updateSpesialisasi(id, req.body);
    if (!updatedSpesialisasi) {
      return res.status(404).json({ message: 'Spesialisasi not found' });
    }
    res.json(updatedSpesialisasi);
  } catch (error) {
    next(error);
  }
};

const deleteSpesialisasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await spesialisasiService.deleteSpesialisasi(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Spesialisasi not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSpesialisasi,
  getSpesialisasiById,
  createSpesialisasi,
  updateSpesialisasi,
  deleteSpesialisasi,
};
