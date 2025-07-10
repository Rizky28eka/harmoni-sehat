import { Router } from 'express';
import pharmacistController from './pharmacist.controller';
import { validate } from '../../middlewares/validator';
import { createPharmacistSchema, updatePharmacistSchema } from './pharmacist.validation';

const router = Router();

router.route('/')
  .post(validate(createPharmacistSchema), pharmacistController.createPharmacist)
  .get(pharmacistController.getAllPharmacists);

router.route('/:id')
  .get(pharmacistController.getPharmacistById)
  .put(validate(updatePharmacistSchema), pharmacistController.updatePharmacist)
  .delete(pharmacistController.deletePharmacist);

export default router;