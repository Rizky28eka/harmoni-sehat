import { Router } from 'express';
import clinicController from './clinic.controller';
import { validate } from '../../middlewares/validator';
import { createClinicSchema, updateClinicSchema } from './clinic.validation';

const router = Router();

router.route('/')
  .post(validate(createClinicSchema), clinicController.createClinic)
  .get(clinicController.getAllClinics);

router.route('/:id')
  .get(clinicController.getClinicById)
  .put(validate(updateClinicSchema), clinicController.updateClinic)
  .delete(clinicController.deleteClinic);

export default router;