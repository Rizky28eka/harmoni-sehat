const adminService = require('./admin.service');
const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const getAllAdmin = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const admin = await adminService.getAllAdmin({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await adminService.getAdminById(id);
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const newAdmin = await adminService.createAdmin(req.body);
    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const updatedAdmin = await adminService.updateAdmin(id, req.body);
    if (!updatedAdmin) {
      throw new ApiError(404, 'Admin not found');
    }
    res.json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await adminService.deleteAdmin(id);
    if (!deleted) {
      throw new ApiError(404, 'Admin not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
