import { Router } from 'express';
import PharmacistController from './pharmacist.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPharmacistSchema, updatePharmacistSchema } from './pharmacist.validation';

const router = Router();

// All pharmacist routes are protected
router.use(protect);

// Route for a logged-in user to create their own pharmacist profile
router.post('/', authorize('pharmacist'), validate(createPharmacistSchema), PharmacistController.createPharmacist);

// Route for a logged-in user to get their own pharmacist profile
router.get('/me', authorize('pharmacist'), PharmacistController.getMyPharmacistProfile);

// Routes for admin/other roles to get all pharmacists
router.get('/', authorize('admin', 'doctor', 'patient', 'pharmacist'), PharmacistController.getAllPharmacists);

// Routes for specific pharmacist by ID
router.get('/:id', authorize('admin', 'doctor', 'patient', 'pharmacist'), PharmacistController.getPharmacistById);
router.put('/:id', authorize('admin', 'pharmacist'), validate(updatePharmacistSchema), PharmacistController.updatePharmacist);
router.delete('/:id', authorize('admin'), PharmacistController.deletePharmacist);

export default router;
