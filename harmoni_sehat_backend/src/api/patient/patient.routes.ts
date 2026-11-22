import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import patientController from './patient.controller';
import { validate } from '../../middlewares/validator';
import { createPatientSchema, updatePatientSchema } from './patient.validation';

const router = Router();
router.use(accessPolicy(["pasien", "dokter", "farmasi"], ["pasien"]));

router.route('/')
  .post(validate(createPatientSchema), patientController.createPatient)
  .get(patientController.getAllPatients);

router.route('/:id')
  .get(patientController.getPatientById)
  .put(validate(updatePatientSchema), patientController.updatePatient)
  .delete(patientController.deletePatient);

export default router;