const userService = require('./user.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/ApiError');

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const users = await userService.getAllUsers({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { password_hash, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const newUser = await userService.createUser({ ...userData, password_hash: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }
    const { id } = req.params;
    const { password_hash, ...userData } = req.body;
    if (password_hash) {
      userData.password_hash = await bcrypt.hash(password_hash, 10);
    }
    const updatedUser = await userService.updateUser(id, userData);
    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      throw new ApiError(404, 'User not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getUserPromos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const promos = await userService.getUserPromos(id, { page: parseInt(page), limit: parseInt(limit) });
    res.json(promos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPromos,
};
