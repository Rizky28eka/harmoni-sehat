const pasienService = require('../services/pasienService');
const { validationResult } = require('express-validator');

/**
 * Controller for handling Pasien related requests.
 */
class PasienController {
  /**
   * Get all pasiens.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async getAllPasiens(req, res, next) {
    try {
      const pasiens = await pasienService.getAllPasiens();
      res.json({ success: true, data: pasiens });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a pasien by ID.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async getPasienById(req, res, next) {
    try {
      const pasien = await pasienService.getPasienById(req.params.id);
      res.json({ success: true, data: pasien });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new pasien.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async createPasien(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const newPasien = await pasienService.createPasien(req.body);
      res.status(201).json({ success: true, data: newPasien });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a pasien by ID.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async updatePasien(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const updatedPasien = await pasienService.updatePasien(req.params.id, req.body);
      res.json({ success: true, data: updatedPasien });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a pasien by ID.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async deletePasien(req, res, next) {
    try {
      const deletedPasien = await pasienService.deletePasien(req.params.id);
      res.json({ success: true, data: deletedPasien });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PasienController();
