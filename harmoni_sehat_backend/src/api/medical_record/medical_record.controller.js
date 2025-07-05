const medicalRecordService = require('./medical_record.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllMedicalRecord = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const medicalRecord = await medicalRecordService.getAllMedicalRecord({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(medicalRecord);
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicalRecord = await medicalRecordService.getMedicalRecordById(id);
    if (!medicalRecord) {
      throw new ApiError(404, 'Medical record not found');
    }
    res.json(medicalRecord);
  } catch (error) {
    next(error);
  }
};

const createMedicalRecord = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newMedicalRecord = await medicalRecordService.createMedicalRecord(req.body);
    res.status(201).json(newMedicalRecord);
  } catch (error) {
    next(error);
  }
};

const updateMedicalRecord = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedMedicalRecord = await medicalRecordService.updateMedicalRecord(id, req.body);
    if (!updatedMedicalRecord) {
      throw new ApiError(404, 'Medical record not found');
    }
    res.json(updatedMedicalRecord);
  } catch (error) {
    next(error);
  }
};

const deleteMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await medicalRecordService.deleteMedicalRecord(id);
    if (!deleted) {
      throw new ApiError(404, 'Medical record not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedicalRecord,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
