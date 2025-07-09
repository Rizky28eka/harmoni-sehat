import { Router } from 'express';
import ClinicController from './clinic.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createClinicSchema, updateClinicSchema } from './clinic.validation';

const router = Router();

// Routes that can be accessed by any authenticated user
router.use(protect);
router.get('/', ClinicController.getAllClinics);
router.get('/:id', ClinicController.getClinicById);

// Routes restricted to admin
router.use(authorize('admin'));
router.post('/', validate(createClinicSchema), ClinicController.createClinic);
router.put('/:id', validate(updateClinicSchema), ClinicController.updateClinic);
router.delete('/:id', ClinicController.deleteClinic);

export default router;
