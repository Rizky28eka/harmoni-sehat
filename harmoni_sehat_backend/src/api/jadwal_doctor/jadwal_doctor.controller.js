const jadwalDoctorService = require('./jadwal_doctor.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllJadwalDoctor = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const jadwalDoctor = await jadwalDoctorService.getAllJadwalDoctor({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(jadwalDoctor);
  } catch (error) {
    next(error);
  }
};

const getJadwalDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jadwalDoctor = await jadwalDoctorService.getJadwalDoctorById(id);
    if (!jadwalDoctor) {
      throw new ApiError(404, 'Jadwal doctor not found');
    }
    res.json(jadwalDoctor);
  } catch (error) {
    next(error);
  }
};

const createJadwalDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newJadwalDoctor = await jadwalDoctorService.createJadwalDoctor(req.body);
    res.status(201).json(newJadwalDoctor);
  } catch (error) {
    next(error);
  }
};

const updateJadwalDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedJadwalDoctor = await jadwalDoctorService.updateJadwalDoctor(id, req.body);
    if (!updatedJadwalDoctor) {
      throw new ApiError(404, 'Jadwal doctor not found');
    }
    res.json(updatedJadwalDoctor);
  } catch (error) {
    next(error);
  }
};

const deleteJadwalDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await jadwalDoctorService.deleteJadwalDoctor(id);
    if (!deleted) {
      throw new ApiError(404, 'Jadwal doctor not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJadwalDoctor,
  getJadwalDoctorById,
  createJadwalDoctor,
  updateJadwalDoctor,
  deleteJadwalDoctor,
};
