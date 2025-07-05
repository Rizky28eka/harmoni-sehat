const konsultasiService = require('./konsultasi.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllKonsultasi = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const konsultasi = await konsultasiService.getAllKonsultasi({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(konsultasi);
  } catch (error) {
    next(error);
  }
};

const getKonsultasiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const konsultasi = await konsultasiService.getKonsultasiById(id);
    if (!konsultasi) {
      throw new ApiError(404, 'Konsultasi not found');
    }
    res.json(konsultasi);
  } catch (error) {
    next(error);
  }
};

const createKonsultasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newKonsultasi = await konsultasiService.createKonsultasi(req.body);
    res.status(201).json(newKonsultasi);
  } catch (error) {
    next(error);
  }
};

const updateKonsultasi = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedKonsultasi = await konsultasiService.updateKonsultasi(id, req.body);
    if (!updatedKonsultasi) {
      throw new ApiError(404, 'Konsultasi not found');
    }
    res.json(updatedKonsultasi);
  } catch (error) {
    next(error);
  }
};

const deleteKonsultasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await konsultasiService.deleteKonsultasi(id);
    if (!deleted) {
      throw new ApiError(404, 'Konsultasi not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getKonsultasiResep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resep = await konsultasiService.getKonsultasiResep(id);
    if (!resep) {
      throw new ApiError(404, 'Resep not found for this konsultasi');
    }
    res.json(resep);
  } catch (error) {
    next(error);
  }
};

const getKonsultasiPembayaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembayaran = await konsultasiService.getKonsultasiPembayaran(id);
    if (!pembayaran) {
      throw new ApiError(404, 'Pembayaran not found for this konsultasi');
    }
    res.json(pembayaran);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKonsultasi,
  getKonsultasiById,
  createKonsultasi,
  updateKonsultasi,
  deleteKonsultasi,
  getKonsultasiResep,
  getKonsultasiPembayaran,
};
