const appointmentService = require('./appointment.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllAppointment = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const appointment = await appointmentService.getAllAppointment({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newAppointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedAppointment = await appointmentService.updateAppointment(id, req.body);
    if (!updatedAppointment) {
      throw new ApiError(404, 'Appointment not found');
    }
    res.json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await appointmentService.deleteAppointment(id);
    if (!deleted) {
      throw new ApiError(404, 'Appointment not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointment,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
