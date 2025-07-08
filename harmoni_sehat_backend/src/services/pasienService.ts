import Pasien from '../models/Pasien';
import createError from 'http-errors';
import logger from '../utils/logger';
import { IPasien } from '../types';

/**
 * Service for handling Pasien data.
 */
class PasienService {
    /**
   * Get all pasiens.
   * @returns {Promise<IPasien[]>} - A promise that resolves to an array of pasiens.
   */
    async getAllPasiens(): Promise<IPasien[]> {
        return await Pasien.find();
    }

    /**
   * Get a pasien by ID.
   * @param {string} id - The ID of the pasien.
   * @returns {Promise<IPasien>} - A promise that resolves to the pasien object.
   */
    async getPasienById(id: string): Promise<IPasien> {
        const pasien = await Pasien.findById(id);
        if (!pasien) {
            logger.warn(`Pasien with ID ${id} not found.`);
            throw createError(404, 'Pasien not found');
        }
        return pasien;
    }

    /**
   * Create a new pasien.
   * @param {IPasien} data - The data for the new pasien.
   * @returns {Promise<IPasien>} - A promise that resolves to the newly created pasien.
   */
    async createPasien(data: IPasien): Promise<IPasien> {
        const newPasien = new Pasien(data);
        return await newPasien.save();
    }

    /**
   * Update a pasien by ID.
   * @param {string} id - The ID of the pasien to update.
   * @param {Partial<IPasien>} data - The updated data for the pasien.
   * @returns {Promise<IPasien>} - A promise that resolves to the updated pasien.
   */
    async updatePasien(id: string, data: Partial<IPasien>): Promise<IPasien> {
        const updatedPasien = await Pasien.findByIdAndUpdate(id, data, { new: true });
        if (!updatedPasien) {
            logger.warn(`Pasien with ID ${id} not found for update.`);
            throw createError(404, 'Pasien not found');
        }
        return updatedPasien;
    }

    /**
   * Delete a pasien by ID.
   * @param {string} id - The ID of the pasien to delete.
   * @returns {Promise<IPasien>} - A promise that resolves to the deleted pasien.
   */
    async deletePasien(id: string): Promise<IPasien> {
        const deletedPasien = await Pasien.findByIdAndDelete(id);
        if (!deletedPasien) {
            logger.warn(`Pasien with ID ${id} not found for deletion.`);
            throw createError(404, 'Pasien not found'); // Changed 44 to 404 for consistency
        }
        return deletedPasien;
    }
}

export default new PasienService();