import { Router } from 'express';
import doctorController from './doctor.controller';
import { validate } from '../../middlewares/validator';
import { createDoctorSchema, updateDoctorSchema } from './doctor.validation';

const router = Router();

router.route('/')
  .post(validate(createDoctorSchema), doctorController.createDoctor)
  .get(doctorController.getAllDoctors);

router.route('/:id')
  .get(doctorController.getDoctorById)
  .put(validate(updateDoctorSchema), doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

export default router;