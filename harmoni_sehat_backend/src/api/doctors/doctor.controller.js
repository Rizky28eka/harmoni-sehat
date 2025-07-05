const doctorService = require('./doctor.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllDoctors = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const doctors = await doctorService.getAllDoctors({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newDoctor = await doctorService.createDoctor(req.body);
    res.status(201).json(newDoctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedDoctor = await doctorService.updateDoctor(id, req.body);
    if (!updatedDoctor) {
      throw new ApiError(404, 'Doctor not found');
    }
    res.json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await doctorService.deleteDoctor(id);
    if (!deleted) {
      throw new ApiError(404, 'Doctor not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getDoctorJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const jadwal = await doctorService.getDoctorJadwal(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(jadwal);
  }  catch (error) {
    next(error);
  }
};

const getDoctorKonsultasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const konsultasi = await doctorService.getDoctorKonsultasi(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(konsultasi);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorJadwal,
  getDoctorKonsultasi,
};
