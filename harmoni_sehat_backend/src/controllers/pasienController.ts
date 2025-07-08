import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import pasienService from '../services/pasienService';

/**
 * Controller for handling Pasien related requests.
 */
class PasienController {
    /**
   * Get all pasiens.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
    async getAllPasiens(req: Request, res: Response, next: NextFunction) {
        try {
            const pasiens = await pasienService.getAllPasiens();
            res.json({ success: true, data: pasiens });
        } catch (error) {
            next(error);
        }
    }

    /**
   * Get a pasien by ID.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
    async getPasienById(req: Request, res: Response, next: NextFunction) {
        try {
            const pasien = await pasienService.getPasienById(req.params.id);
            res.json({ success: true, data: pasien });
        } catch (error) {
            next(error);
        }
    }

    /**
   * Create a new pasien.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
    async createPasien(req: Request, res: Response, next: NextFunction) {
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
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
    async updatePasien(req: Request, res: Response, next: NextFunction) {
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
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
    async deletePasien(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedPasien = await pasienService.deletePasien(req.params.id);
            res.json({ success: true, data: deletedPasien });
        } catch (error) {
            next(error);
        }
    }
}

export default new PasienController();