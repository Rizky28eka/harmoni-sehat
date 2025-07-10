import { Router } from 'express';
import doctorClinicController from './doctorClinic.controller';
import { validate } from '../../middlewares/validator';
import { createDoctorClinicSchema, updateDoctorClinicSchema } from './doctorClinic.validation';

const router = Router();

router.route('/')
  .post(validate(createDoctorClinicSchema), doctorClinicController.createDoctorClinic)
  .get(doctorClinicController.getAllDoctorClinics);

router.route('/:id')
  .get(doctorClinicController.getDoctorClinicById)
  .put(validate(updateDoctorClinicSchema), doctorClinicController.updateDoctorClinic)
  .delete(doctorClinicController.deleteDoctorClinic);

export default router;