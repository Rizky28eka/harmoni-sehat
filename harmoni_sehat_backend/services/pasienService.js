const Pasien = require('../models/Pasien');
const createError = require('http-errors');

/**
 * Service for handling Pasien data.
 */
class PasienService {
  /**
   * Get all pasiens.
   * @returns {Promise<Array>} - A promise that resolves to an array of pasiens.
   */
  async getAllPasiens() {
    return await Pasien.find();
  }

  /**
   * Get a pasien by ID.
   * @param {string} id - The ID of the pasien.
   * @returns {Promise<object>} - A promise that resolves to the pasien object.
   */
  async getPasienById(id) {
    const pasien = await Pasien.findById(id);
    if (!pasien) {
      throw createError(404, 'Pasien not found');
    }
    return pasien;
  }

  /**
   * Create a new pasien.
   * @param {object} data - The data for the new pasien.
   * @returns {Promise<object>} - A promise that resolves to the newly created pasien.
   */
  async createPasien(data) {
    const newPasien = new Pasien(data);
    return await newPasien.save();
  }

  /**
   * Update a pasien by ID.
   * @param {string} id - The ID of the pasien to update.
   * @param {object} data - The updated data for the pasien.
   * @returns {Promise<object>} - A promise that resolves to the updated pasien.
   */
  async updatePasien(id, data) {
    const updatedPasien = await Pasien.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPasien) {
      throw createError(404, 'Pasien not found');
    }
    return updatedPasien;
  }

  /**
   * Delete a pasien by ID.
   * @param {string} id - The ID of the pasien to delete.
   * @returns {Promise<object>} - A promise that resolves to the deleted pasien.
   */
  async deletePasien(id) {
    const deletedPasien = await Pasien.findByIdAndDelete(id);
    if (!deletedPasien) {
      throw createError(44, 'Pasien not found');
    }
    return deletedPasien;
  }
}

module.exports = new PasienService();
