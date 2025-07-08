import express from 'express';
import pasienController from '../controllers/pasienController';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules for creating and updating a pasien
const pasienValidationRules = [
    body('nama').notEmpty().withMessage('Nama is required'),
    body('nik').optional().isLength({ min: 16, max: 16 }).withMessage('NIK must be 16 characters long'),
    body('jenis_kelamin').isIn(['Laki-laki', 'Perempuan']).withMessage('Invalid gender'),
    body('no_telepon').optional().isMobilePhone('id-ID').withMessage('Invalid Indonesian phone number'),
];

// Routes for Pasien
router.get('/', pasienController.getAllPasiens);
router.get('/:id', pasienController.getPasienById);
router.post('/', pasienValidationRules, pasienController.createPasien);
router.put('/:id', pasienValidationRules, pasienController.updatePasien);
router.delete('/:id', pasienController.deletePasien);

export default router;